import { ipcMain, IpcMainEvent } from "electron"
import { ACTIONS_CHANNELS } from "../channels"
import { aria2 } from "../../main"
import { DataSourceRepo } from "../../database/database"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

export const ipcActionsHandler = () => {
  
  ipcMain.handle(ACTIONS_CHANNELS.STOP_DOWNLOAD_BY_GID, async (_: IpcMainInvokeEvent, gid: string) => {
    return await aria2.sendAria2cRequest("pause", [gid])
    
  })
  
  ipcMain.handle(ACTIONS_CHANNELS.UNPAUSE_ALL, async (_: IpcMainInvokeEvent) => {
    return await aria2.sendAria2cRequest("unpauseAll")
  })
  
  ipcMain.on(ACTIONS_CHANNELS.UNPAUSE_BY_GID, async (_: IpcMainEvent, gid: string) => {
    try {
      await aria2.sendAria2cRequest("unpause", [gid])
    }
    catch (error) {
      console.log(error)
    }
  })
  
  ipcMain.on(ACTIONS_CHANNELS.STOP_ALL_DOWNLOADS, async (_: IpcMainInvokeEvent) => {
    try {
      await aria2.sendAria2cRequest("pauseAll")
    }
    catch (error) {
      console.log(error)
    }
  })
  ipcMain.on(ACTIONS_CHANNELS.REMOVE_DOWNLOAD_BY_GID, async (event: IpcMainEvent, gid: string) => {
    try {
      await DataSourceRepo.getRepository("downloads").delete({ gid: gid })
      await aria2.sendAria2cRequest("removeDownloadResult", [gid])
      
    }
    catch (error) {
      console.log(error)
    }
  })
  
  
}
