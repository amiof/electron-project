import { ipcMain, webContents } from "electron"
import { SCHEDULE_CHANNELS } from "../channels"
import { DataSourceRepo } from "../../database/database"
import { TDownloads } from "../../types"
import { In } from "typeorm"
import { schedulerInstance } from "../../main"
import { electronStore } from "../../store/electronStore"

export const ipcSchedulerHandler = () => {
  ipcMain.handle(SCHEDULE_CHANNELS.GET_SCHEDULER_DOWNLOAD_ROWS, () => {
    return DataSourceRepo.getRepository("scheduler").find()
  })
  
  ipcMain.on(SCHEDULE_CHANNELS.ADD_ROWS_TO_SCHEDULER_QUEUE, (_, selectedRow: TDownloads[]) => {
    selectedRow.map(async (row) => {
      const isAvailable = await DataSourceRepo.getRepository("scheduler").findBy({ gid: row.Gid })
      if (!isAvailable.length) {
        await DataSourceRepo.getRepository("scheduler").insert({ gid: row.Gid })
      }
    })
  })
  
  ipcMain.on(SCHEDULE_CHANNELS.Remove_Rows_From_SCHEDULE_QUEUE, async (_, selectedRow: TDownloads[]) => {
    const repo = DataSourceRepo.getRepository("scheduler")
    
    const gids = selectedRow.map((r) => r.Gid)
    
    const rows = await repo.findBy({ gid: In(gids) })
    
    await repo.delete({ gid: In(rows.map((r) => r.gid)) })
  })
  
  ipcMain.handle(
    SCHEDULE_CHANNELS.ADD_SCHEDULER_TIME,
    (_, startTime: string | undefined, endTime: string | undefined, keepAlive: boolean, powerOff: boolean) => {
      const schedulerConfig = {
        startTime,
        endTime,
        keepAlive,
        powerOff
      }
      
      schedulerInstance.clearScheduler()
      electronStore.set("scheduler", schedulerConfig)
      schedulerInstance.setKeepAlive(keepAlive)
      schedulerInstance.run({ startTime, endTime, powerOff, keepAlive })
      webContents.getAllWebContents().forEach((contents) => {
        contents.send(SCHEDULE_CHANNELS.SCHEDULER_CONFIG_UPDATED, schedulerConfig)
      })
      return schedulerConfig
    }
  )
  
  ipcMain.handle(SCHEDULE_CHANNELS.GET_SCHEDULER_CONFIG, () => {
    return electronStore.get("scheduler")
  })
}
