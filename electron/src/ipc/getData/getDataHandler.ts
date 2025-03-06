import { ipcMain } from "electron"
import { DataSourceRepo } from "../../database/database"
import { GETDATA_CHANNELS } from "../channels"
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
  
}
export default ipcGetdataHanlder