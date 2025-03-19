import { ipcMain } from "electron"
import { directionfolder } from "../../utils"
import { aria2 } from "../../main"
import { DOWNLOAD_CHANNELS } from "../channels"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

const ipcDownloaddHandler = () => {
  
  ipcMain.handle(DOWNLOAD_CHANNELS.ADD_DOWNLOAD_LINK, async (event: IpcMainInvokeEvent, url: string, directory?: string) => {
    const dir = directionfolder(url)
    console.log("dir:", dir)
    return await aria2.sendAria2cRequest("aria2.addUri", [[url], {
      dir: directory ? directory : dir,
      "max-connection-per-server": 16, // Max connections per server
      split: 16, // Split into N connections
      "min-split-size": "1M", // Minimum split size
      continue: true // Enable resuming}]);
    }])
  })
  
  ipcMain.handle("tell-active", async (event: IpcMainInvokeEvent) => {
    return await aria2.sendAria2cRequest("aria2.tellActive")
  })
  
  ipcMain.handle("tell-stoped", async (event: IpcMainInvokeEvent) => {
    return await aria2.sendAria2cRequest("aria2.tellStopped", [-1, 100])
  })
  
  ipcMain.handle("tell-waiting", async (event: IpcMainInvokeEvent) => {
    return await aria2.sendAria2cRequest("aria2.tellWaiting", [-1, 100])
  })
}

export default ipcDownloaddHandler