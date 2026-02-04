import { BrowserWindow, ipcMain, Menu, Notification } from "electron"
import { ACTIONS_CHANNELS, POPUP_CHANNELS, UTILS_CHANNELS } from "../channels"
import { resMetadataUrls, STATUS_TYPE, TDownloads, TNotificationDetailes } from "../../types"
import { directionFolder, extractFilenameFromDisposition, generateId } from "../../utils"
import { createPopupWindow, iconPathContextMenu } from "../utils"
import { mainWindow } from "../../main"
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
  
  ipcMain.handle(UTILS_CHANNELS.SHOW_CONTEXT_MENU, async (event: IpcMainInvokeEvent, selectedDownloadRow: TDownloads[] | []) => {
    
    // const iconPath = path.join(process.resourcesPath, "assets", "icon.png")
    const isActive = selectedDownloadRow.filter(item => item.Status === STATUS_TYPE.ACTIVE)
    const isResume = selectedDownloadRow.filter(item => item.Status !== STATUS_TYPE.ACTIVE && item.Status !== STATUS_TYPE.COMPLETE)
    
    const menu = Menu.buildFromTemplate([
      {
        label: "Add new link",
        icon: iconPathContextMenu("plus-32.png"),
        visible: !selectedDownloadRow.length,
        click: () => {
          const id = generateId()
          ipcMain.emit(POPUP_CHANNELS.ADD_LINK_POPUP, event, id)
          mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "add-link")
        }
      },
      {
        label: "Options",
        visible: !selectedDownloadRow.length,
        icon: iconPathContextMenu("setting-32.png"),
        click: () => {
          const id = generateId()
          ipcMain.emit(POPUP_CHANNELS.POPUP_OPEN_OPTIONS, event, id)
          mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "open-options")
        }
      },
      {
        label: "Reload",
        visible: !selectedDownloadRow.length,
        role: "reload",
        icon: iconPathContextMenu("reload-32.png"),
        click: () => {
          mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "reload-app")
        }
      },
      {
        label: "Quite",
        visible: !selectedDownloadRow.length,
        role: "quit",
        icon: iconPathContextMenu("exit-32.png")
      },
      //-------------
      {
        // icon:path.join(process.resourcesPath, "assets", "icon_32x32.png"),
        // icon:path.join(__dirname,"..","..","..","..","assets","icon_32x32.png"),
        label: "Delete selected rows",
        icon: iconPathContextMenu("delete-32.png"),
        visible: !!selectedDownloadRow.length,
        click: () => {
          const gidList = selectedDownloadRow.map(selected => selected.Gid)
          ipcMain.emit(ACTIONS_CHANNELS.REMOVE_SELECTED_DOWNLOADS, event, gidList)
          mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "delete-rows")
        }
      },
      {
        label: "Stop selected rows",
        icon: iconPathContextMenu("pause-32.png"),
        visible: !!selectedDownloadRow.length,
        enabled: !!isActive.length,
        click: () => {
          const ActiveGid = isActive.map(selected => selected.Gid)
          ActiveGid.map(gid => {
            ipcMain.emit(ACTIONS_CHANNELS.STOP_DOWNLOAD_BY_GID, event, gid)
            mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "stop-downloads")
          })
        }
      },
      {
        label: "Resume downloads",
        visible: !!selectedDownloadRow.length,
        enabled: !!isResume.length,
        icon: iconPathContextMenu("resume-32.png"),
        click: () => {
          isResume.map((item) => {
            const gid = item?.Gid
            createPopupWindow({
              windowTitle: "download",
              height: 400,
              width: 900,
              hashRoute: `downloadStart/:${gid}`,
              windowId: gid
            })
            ipcMain.emit(ACTIONS_CHANNELS.UNPAUSE_BY_GID, event, gid)
            mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "resume")
          })
        }
      },
      // {
      //   label: "Delete downloaded Files",
      //   visible: !!selectedDownloadRow.length,
      //   icon: iconPathContextMenu("delete-32.png"),
      //   click: () => {
      //     console.log("delete")
      //   }
      // },
      {
        label: "Open folder",
        visible: !!selectedDownloadRow.length,
        icon: iconPathContextMenu("folder-32.png"),
        click: () => {
          selectedDownloadRow.map((item) => {
            ipcMain.emit(ACTIONS_CHANNELS.OPEN_FOLDER, event, item.SavePath)
            mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "open-folders")
          })
        }
      },
      {
        label: "Add to scheduler ",
        visible: !!selectedDownloadRow.length,
        icon: iconPathContextMenu("scheduler-32.png"),
        click: () => {
          console.log("scheduler")
          mainWindow?.webContents.send(UTILS_CHANNELS.CONTEXT_MENU_ACTION, "add-scheduler")
        }
      }
    ])
    
    const window = BrowserWindow.fromWebContents(event.sender) as BrowserWindow
    
    menu.popup({
      window: window
    })
    
  })
 
  
}
