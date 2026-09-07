import { ipcMain, webContents } from "electron"
import { SCHEDULE_CHANNELS } from "../channels"
import { SchedulerRepo, In } from "../../database/database"
import { TDownloads } from "../../types"
import { schedulerInstance } from "../../main"
import { electronStore } from "../../store/electronStore"

export const ipcSchedulerHandler = () => {
  ipcMain.handle(SCHEDULE_CHANNELS.GET_SCHEDULER_DOWNLOAD_ROWS, async () => {
    return SchedulerRepo.find()
  })
  
  ipcMain.on(SCHEDULE_CHANNELS.ADD_ROWS_TO_SCHEDULER_QUEUE, (_, selectedRow: TDownloads[]) => {
    selectedRow.map(async (row) => {
      const isAvailable = SchedulerRepo.findBy({ gid: row.Gid })
      if (!isAvailable.length) {
        SchedulerRepo.insert({ gid: row.Gid })
      }
    })
  })
  
  ipcMain.on(SCHEDULE_CHANNELS.Remove_Rows_From_SCHEDULE_QUEUE, async (_, selectedRow: TDownloads[]) => {
    const gids = selectedRow.map((r) => r.Gid)
    
    const rows = SchedulerRepo.findBy({ gid: In(gids) })
    
    SchedulerRepo.delete({ gid: In(rows.map((r) => r.gid)) })
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
