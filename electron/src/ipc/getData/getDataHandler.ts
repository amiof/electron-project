import { ipcMain } from "electron"
import { DataSourceRepo } from "../../database/database"
import { GETDATA_CHANNELS } from "../channels"
import { aria2 } from "../../main"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

const ipcGetdataHanlder = () => {
  
  ipcMain.handle(GETDATA_CHANNELS.GET_DOWNLOADS, async (event: IpcMainInvokeEvent) => {
    try {
      return await DataSourceRepo.getRepository("downloads").find()
    }
    catch (error) {
      throw new Error("Error while getting downloads")
    }
  })
  ipcMain.handle(GETDATA_CHANNELS.GET_TELL_STATUS, async (event: IpcMainInvokeEvent, gid: string) => {
    try {
      return await aria2.sendAria2cRequest("tellStatus", [gid])
    }
    catch (error) {
      console.log("Error while getting local state:", error)
    }
    
  })
  ipcMain.handle(GETDATA_CHANNELS.GET_GLOBAL_STATE, async (event: IpcMainInvokeEvent, id) => {
    try {
      return await aria2.sendAria2cRequest("getGlobalStat")
    }
    catch (error) {
      console.log("Error while getting local state:", error)
    }
    
  })
  
}
export default ipcGetdataHanlder