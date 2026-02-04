import { ipcMain } from "electron"
import { DataSourceRepo } from "../../database/database"
import { GET_DATA_CHANNELS } from "../channels"
import { aria2, mainWindow } from "../../main"
import { getFilesInDirectory } from "../../utils"
import { TtellRes } from "../../types"
import { InsertResult } from "typeorm"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

let activeData: any[] = []


const ipcGetDataHandler = () => {
  
  ipcMain.handle(GET_DATA_CHANNELS.GET_DOWNLOADS, async (event: IpcMainInvokeEvent) => {
    try {
      const downloads = await DataSourceRepo.getRepository("downloads").find()
      const torrents = await DataSourceRepo.getRepository("torrents").findBy({ status: "complete" })
      
      return [...downloads, ...torrents]
    }
    catch (error) {
      throw new Error("Error while getting downloads")
    }
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.ADD_LINK_TO_DB, async (event: IpcMainInvokeEvent, downloadRow: TtellRes) => {
    try {
      let result: InsertResult
      if ("infoHash" in downloadRow) {
        result = await DataSourceRepo.getRepository("torrents").insert({ downloadRow })
      }
      else {
        result = await DataSourceRepo.getRepository("downloads").insert(downloadRow)
      }
      return result
    }
    catch (error) {
      console.log(error)
    }
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.UPDATE_DOWNLOAD_ROW_STATUS, async (event: IpcMainInvokeEvent, gid: string, downloadRow: TtellRes) => {
    try {
      let result: InsertResult
      if ("infoHash" in downloadRow) {
        await DataSourceRepo.getRepository("torrents").createQueryBuilder().delete().where("gid = :gid", { gid: gid }).execute()
        result = await DataSourceRepo.getRepository("torrents").insert(downloadRow)
      }
      else {
        await DataSourceRepo.getRepository("downloads").createQueryBuilder().delete().where("gid = :gid", { gid: gid }).execute()
        result = await DataSourceRepo.getRepository("downloads").insert(downloadRow)
      }
      return result
    }
    catch (error) {
      console.log(error)
    }
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.GET_COMPLETED_ROW_FROM_DB, async (event: IpcMainInvokeEvent) => {
    try {
      const downloadComplated = await DataSourceRepo.getRepository("downloads").findBy({ status: "complete" })
      const torrentsComplated = await DataSourceRepo.getRepository("torrents").findBy({ status: "complete" })
      return [...downloadComplated, ...torrentsComplated]
      
    }
    catch (error) {
      console.log(error)
    }
    
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.GET_TELL_STATUS, async (event: IpcMainInvokeEvent, gid: string) => {
    try {
      return await aria2.sendAria2cRequest("tellStatus", [gid])
    }
    catch (error) {
      console.log("Error while getting local state:", error)
    }
    
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.GET_GLOBAL_STATE, async (event: IpcMainInvokeEvent, id) => {
    try {
      return await aria2.sendAria2cRequest("getGlobalStat")
    }
    catch (error) {
      console.log("Error while getting local state:", error)
    }
    
  })
  
  //for handle update main window when added new download
  ipcMain.on(GET_DATA_CHANNELS.SET_DOWNLOAD_DATA_ACTIVE, (event, data) => {
    activeData.push(data)
    mainWindow?.webContents.send(GET_DATA_CHANNELS.DATA_CHANGE, data)
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.GET_DOWNLOAD_DATA_ACTIVE, () => {
    return activeData
  })
  
  ipcMain.handle(GET_DATA_CHANNELS.CHECK_DOWNLOADED_FILES_DETAILS, () => {
    return getFilesInDirectory()
  })
  
}
export default ipcGetDataHandler