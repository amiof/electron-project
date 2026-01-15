import { ipcMain, Notification } from "electron"
import { UTILS_CHANNELS } from "../channels"
import { resMetadataUrls, TNotificationDetailes } from "../../types"
import { directionFolder, extractFilenameFromDisposition } from "../../utils"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

export const ipcUtilsHandler = () => {
  
  ipcMain.handle(UTILS_CHANNELS.SHOW_NOTIFICATION, (_event: IpcMainInvokeEvent, notifDetailes: TNotificationDetailes) => {
    
    const { title, body } = notifDetailes
    
    const notif = new Notification({
      title: title,
      body: body
      // You can also add an icon
      // icon: path.join(__dirname, 'icon.png')
    })
    notif.show()
    // Handle click events
    // notif.on("click", () => {
    //   console.log("User clicked the notification")
    //   // e.g., focus your main window
    // })
  })
  
  ipcMain.handle(UTILS_CHANNELS.GET_METADATA_URLS, async (_event: IpcMainInvokeEvent, url: string) => {
    
    let urlResponse: resMetadataUrls = {
      fileName: null,
      size: null,
      typeUrl: "direct",
      savePath: directionFolder(url),
      resume: null
    }
    
    if (url.startsWith("magnet:")) {
      urlResponse.typeUrl = "magnet"
    }
    
    try {
      
      const response = await fetch(url, { method: "HEAD" })
      const contentType = response.headers.get("content-type") || ""
      const disposition = response.headers.get("Content-Disposition")
      const fileName = extractFilenameFromDisposition(disposition)
      const contentLength = response.headers.get("Content-Length")
      const acceptRanges = response.headers.get("Accept-ranges")
      
      urlResponse.size = contentLength
      urlResponse.fileName = fileName
      
      if (fileName?.endsWith(".torrent") || url.startsWith(".torrent") ||
        contentType.includes("application/x-bittorrent") ||
        contentType.includes("application/bittorrent")) {
        urlResponse.typeUrl = "torrent"
      }
      
      //for check resume able link
      urlResponse.resume = !!(contentLength && acceptRanges === "bytes")
      
      
    }
    catch (error) {
      
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-0" } // get first byte
        })
        const contentLength2 = response.headers.get("Content-Range")?.split("/")[1]
        const disposition = response.headers.get("Content-Disposition")
        const fileName = extractFilenameFromDisposition(disposition)
        const contentType = response.headers.get("content-type") || ""
        const acceptRanges = response.headers.get("Accept-ranges")
        
        if (contentLength2) {
          urlResponse.size = contentLength2
        }
        else {
          urlResponse.size = null
        }
        urlResponse.fileName = fileName
        
        
        if (fileName?.endsWith(".torrent") || url.startsWith(".torrent") ||
          contentType.includes("application/x-bittorrent") ||
          contentType.includes("application/bittorrent")) {
          urlResponse.typeUrl = "torrent"
        }
        
        //for check resumeable link
        urlResponse.resume = !!(contentLength2 && acceptRanges === "bytes")
        
        
      }
      catch (error) {
        console.error("error in get url header2", error)
        
      }
      
      console.error("error in get url header1", error)
    }
    
    return urlResponse
    
  })
  
}
