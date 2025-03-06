import { ipcMain, IpcMainEvent } from "electron"
import { directionfolder } from "../../utils"
import { aria2 } from "../../main"
import { DOWNLOAD_CHANNELS } from "../channels"

const ipcDownloaddHandler = () => {
  
  ipcMain.on(DOWNLOAD_CHANNELS.ADD_DOWNLOAD_LINK, (event: IpcMainEvent, url: string, directory?: string) => {
    
    const dir = directionfolder(url)
    console.log("dir:", dir)
    aria2.sendAria2cRequest("aria2.addUri", [[url], {
      dir: directory ? directory : dir,
      "max-connection-per-server": 16, // Max connections per server
      split: 16, // Split into N connections
      "min-split-size": "1M", // Minimum split size
      continue: true // Enable resuming}]);
    }])
  })
  
  ipcMain.on("add-download", (event: IpcMainEvent, url: string) => {
    aria2.sendAria2cRequest("aria2.addUri", [[url]])
  })
  
  ipcMain.on("tell-active", (event: IpcMainEvent) => {
    aria2.sendAria2cRequest("aria2.tellActive")
  })
  
  ipcMain.on("tell-stoped", (event: IpcMainEvent) => {
    aria2.sendAria2cRequest("aria2.tellStopped", [-1, 100])
  })
  
  ipcMain.on("tell-waiting", (event: IpcMainEvent) => {
    aria2.sendAria2cRequest("aria2.tellWaiting", [-1, 100])
  })
}

export default ipcDownloaddHandler