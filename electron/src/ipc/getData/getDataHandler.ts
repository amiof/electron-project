import { ipcMain } from "electron"
import { DataSourceRepo } from "../../database/database"
import { IPC_GETDATA_CHANNELS } from "../utils"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent


const getDataHandler = () => {
  
  ipcMain.handle(IPC_GETDATA_CHANNELS.GET_DOWNLOAD, async (event: IpcMainInvokeEvent) => {
    try {
      return await DataSourceRepo.getRepository("downloads").find()
    }
    catch (error) {
      throw new Error("Error while getting downloads")
    }
  })
  
}

export default getDataHandler