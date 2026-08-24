import { exec } from "node:child_process"
import { clearTimeout } from "node:timers"
import { ipcMain, powerSaveBlocker } from "electron"
import os from "os"
import { In } from "typeorm"
import { DataSourceRepo } from "../database/database"
import { ACTIONS_CHANNELS, POPUP_CHANNELS } from "../ipc/channels"
import { createPopupWindow } from "../ipc/utils"
import { aria2, schedulers } from "../main"
import { electronStore } from "../store/electronStore"
import { TScheduler, TSchedulerDatabase } from "../types"

export class SchedulerProcess {
  
  private keepAlive: undefined | boolean = false
  private blockerId: number | null = null
  private queueGid: TSchedulerDatabase[] = []
  private errorGid: string[] = []
  private activeGid: string | undefined = undefined
  private counterDownload: number = 0
  private successDownloadedGid: string[] = []
  private aria2ListenersInitialized = false
  
  // time must be like "12:30" for use this function
  diffTimeNow = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    
    const now = new Date()
    const target = new Date()
    
    target.setHours(h, m, 0, 0)
    
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }
    
    return target.getTime() - now.getTime()
  }
  
  run = (startTime: string | undefined, endTime: string | undefined, powerOffStatus?: boolean, keepAliveItem?: boolean) => {
    if (startTime) {
      const startDiff = this.diffTimeNow(startTime)
      
      schedulers["start"] = setTimeout(async () => {
        console.log("start time reached")
        await this.getDownloadGid()
        if (this.counterDownload === 0) {
          await this.downloadRow()
        }
        
        if (!schedulers["end"]) {
          this.clearScheduler()
        }
        
        if (keepAliveItem) {
          this.setKeepAlive(true)
        }
        else {
          this.setKeepAlive(false)
        }
        
      }, startDiff)
    }
    
    this.setupAria2Listeners()
    
    if (endTime) {
      const endDiff = this.diffTimeNow(endTime)
      // end timer
      schedulers["end"] = setTimeout(() => {
        console.log("end time reached")
        this.clearScheduler()
        
        if (this.activeGid) {
          //stop download before power off
          ipcMain.emit(ACTIONS_CHANNELS.STOP_DOWNLOAD_BY_GID, "stop", this.activeGid)
          ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", this.activeGid)
        }
        if (powerOffStatus) {
          setTimeout(() => {
            this.powerOffSystem()
          }, 2000)
        }
      }, endDiff)
      
      this.counterDownload = 0
    }
    
    console.log("active timers:", schedulers)
  }
  setupAria2Listeners = () => {
    if (this.aria2ListenersInitialized) {
      return
    }
    this.aria2ListenersInitialized = true
    
    aria2.on("onDownloadComplete", async ({ gid }) => {
      console.log("✅ Download finished:", gid)
      
      ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", gid)
      
      this.successDownloadedGid.push(gid)
      
      await this.deletedDownloadedGidFromDb([gid])
      
      if (this.activeGid === gid) {
        this.activeGid = undefined
      }
      
      if (this.queueGid.length) {
        await this.downloadRow()
      }
      else {
        this.counterDownload = 0
      }
    })
    
    aria2.on("onDownloadPause", ({ gid }) => {
      console.log("⏸️ Download paused:", gid)
    })
    
    aria2.on("onDownloadError", async ({ gid }) => {
      console.log("⛔ Download failed:", gid)
      
      this.errorGid.push(gid)
      
      ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", gid)
      
      if (this.activeGid === gid) {
        this.activeGid = undefined
      }
      
      if (this.queueGid.length) {
        await this.downloadRow()
      }
      else {
        this.counterDownload = 0
      }
    })
  }
  
  powerOffSystem = () => {
    const platform = os.platform()
    if (platform === "win32") {
      exec("shutdown /s /t 0")
    }
    else if (platform === "linux") {
      exec("shutdown now")
    }
    else if (platform === "darwin") {
      exec("sudo shutdown -h now")
    }
  }
  
  clearScheduler = () => {
    if (schedulers["start"]) {
      clearTimeout(schedulers["start"])
      schedulers["start"] = undefined
    }
    
    if (schedulers["end"]) {
      clearTimeout(schedulers["end"])
      schedulers["end"] = undefined
    }
    
    const storeScheduler: TScheduler = {
      startTime: undefined,
      endTime: undefined,
      keepAlive: false,
      powerOff: false
    }
    
    electronStore.set("scheduler", storeScheduler)
  }
  
  setTimeToElectronStore = (schedulerConfig: TScheduler, delay: number) => {
    setTimeout(() => {
      electronStore.set("scheduler", schedulerConfig)
    }, delay)
  }
  
  // when program start check if set scheduler in store run scheduler
  initScheduler = () => {
    const schedulerStore = electronStore.get("scheduler")
    const { startTime, endTime, powerOff, keepAlive } = schedulerStore
    if (startTime) {
      this.run(startTime, endTime, powerOff)
    }
    else {
      this.clearScheduler()
    }
    // change power save
    this.setKeepAlive(keepAlive)
  }
  
  setKeepAlive = (keepAlive: boolean) => {
    this.clearKeepAlive()
    
    this.keepAlive = keepAlive
    
    if (keepAlive) {
      this.blockerId = powerSaveBlocker.start("prevent-display-sleep")
    }
    else {
      this.blockerId = powerSaveBlocker.start("prevent-app-suspension")
    }
  }
  
  clearKeepAlive = () => {
    if (this.blockerId != null) {
      powerSaveBlocker.stop(this.blockerId)
      this.blockerId = null
    }
    this.keepAlive = false
  }
  
  getDownloadGid = async () => {
    this.queueGid = (await DataSourceRepo.getRepository("scheduler").find()) as TSchedulerDatabase[]
    // console.log("%c 1 --> Line: 144||schedulerProcess.ts\n this.schedulerGids: ","color:#f0f;", this.schedulerGids);
  }
  
  downloadRow = async () => {
    const databaseGid = this.queueGid.shift()
    
    if (!databaseGid?.gid) {
      return
    }
    
    const { gid } = databaseGid
    
    this.activeGid = gid
    this.counterDownload++
    
    createPopupWindow({
      windowTitle: "download",
      height: 400,
      width: 900,
      hashRoute: `downloadStart/:${gid}`,
      windowId: gid
    })
    
    ipcMain.emit(ACTIONS_CHANNELS.UNPAUSE_BY_GID, "queue", gid)
  }
  
  deletedDownloadedGidFromDb = async (gids: string[]) => {
    const repo = DataSourceRepo.getRepository("scheduler")
    
    const rows = await repo.findBy({ gid: In(gids) })
    
    await repo.delete({ gid: In(rows.map((r) => r.gid)) })
  }
  
  endedDownload = async () => {
    if (this.queueGid.length === 0 && this.successDownloadedGid.length) {
      await this.getDownloadGid()
      if (this.queueGid.length > 0) {
        await this.downloadRow()
      }
    }
  }
}