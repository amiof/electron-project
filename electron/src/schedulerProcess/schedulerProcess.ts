import { exec } from "node:child_process"
import { clearTimeout } from "node:timers"
import { ipcMain, powerSaveBlocker, webContents } from "electron"
import os from "os"
import { In } from "typeorm"
import { DataSourceRepo } from "../database/database"
import { ACTIONS_CHANNELS, POPUP_CHANNELS, SCHEDULE_CHANNELS } from "../ipc/channels"
import { createPopupWindow } from "../ipc/utils"
import { aria2, schedulers } from "../main"
import { electronStore } from "../store/electronStore"
import { TScheduler, TSchedulerDatabase } from "../types"

/** Scheduler timer keys */
const SCHEDULER_KEYS = {
  START: "start",
  END: "end"
} as const

/** Shutdown commands per platform */
const SHUTDOWN_COMMANDS: Record<string, string> = {
  win32: "shutdown /s /t 0",
  linux: "shutdown now",
  darwin: "sudo shutdown -h now"
}

/** Parameters for starting the scheduler */
interface SchedulerRunParams {
  startTime: string | undefined
  endTime: string | undefined
  powerOff?: boolean
  keepAlive?: boolean
}

export class SchedulerProcess {
  private enableListener = false
  private blockerId: number | null = null
  private downloadQueue: TSchedulerDatabase[] = []
  private activeGid: string | undefined = undefined
  private counterDownload = 0
  private aria2ListenersInitialized = false
  
  /**
   * Start the scheduler with specified times and options
   */
  run = ({ startTime, endTime, powerOff = false, keepAlive = false }: SchedulerRunParams): void => {
    if (startTime) {
      const startDiff = this.diffTimeNow(startTime)
      
      schedulers[SCHEDULER_KEYS.START] = setTimeout(async () => {
        console.log("[Scheduler] Start time reached")
        this.enableListener = true
        this.setupAria2Listeners()
        
        await this.refreshDownloadQueue()
        
        if (this.counterDownload === 0) {
          await this.startNextDownload()
        }
        
        if (!schedulers[SCHEDULER_KEYS.END]) {
          this.clearScheduler()
        }
        
        this.setKeepAlive(keepAlive)
      }, startDiff)
    }
    
    if (endTime) {
      const endDiff = this.diffTimeNow(endTime)
      
      schedulers[SCHEDULER_KEYS.END] = setTimeout(() => {
        this.enableListener = false
        console.log("[Scheduler] End time reached")
        this.clearScheduler()
        
        this.stopActiveDownload()
        this.closeActivePopup()
        
        if (powerOff) {
          setTimeout(() => this.powerOffSystem(), 2000)
        }
      }, endDiff)
      
      this.counterDownload = 0
    }
    
    console.log("[Scheduler] Active timers:", schedulers)
  }
  
  /**
   * Clear all scheduler timers and reset store
   */
  clearScheduler = (): void => {
    if (schedulers[SCHEDULER_KEYS.START]) {
      clearTimeout(schedulers[SCHEDULER_KEYS.START])
      schedulers[SCHEDULER_KEYS.START] = undefined
    }
    
    if (schedulers[SCHEDULER_KEYS.END]) {
      clearTimeout(schedulers[SCHEDULER_KEYS.END])
      schedulers[SCHEDULER_KEYS.END] = undefined
    }
    
    const resetConfig: TScheduler = {
      startTime: undefined,
      endTime: undefined,
      keepAlive: false,
      powerOff: false
    }
    
    electronStore.set("scheduler", resetConfig)
    webContents.getAllWebContents().forEach((contents) => {
      contents.send(SCHEDULE_CHANNELS.SCHEDULER_CONFIG_UPDATED, resetConfig)
    })
  }
  
  /**
   * Save scheduler config to electron store with delay
   * @param config - Scheduler configuration
   * @param delay - Delay in milliseconds
   */
  setTimeToElectronStore = (config: TScheduler, delay: number): void => {
    setTimeout(() => {
      electronStore.set("scheduler", config)
    }, delay)
  }
  
  /**
   * Initialize scheduler from stored config on app start
   */
  initScheduler = (): void => {
    const schedulerStore = electronStore.get("scheduler")
    const { startTime, endTime, powerOff, keepAlive } = schedulerStore
    
    if (startTime) {
      this.run({ startTime, endTime, powerOff, keepAlive })
    }
    else {
      this.clearScheduler()
    }
    
    this.setKeepAlive(keepAlive)
  }
  
  /**
   * Set power save blocker mode
   * @param enabled - Whether to keep system awake
   */
  setKeepAlive = (enabled: boolean): void => {
    this.clearKeepAlive()
    
    const blockType = enabled ? "prevent-display-sleep" : "prevent-app-suspension"
    
    this.blockerId = powerSaveBlocker.start(blockType)
  }
  
  /**
   * Calculate time difference from now to a target time
   * @param time - Target time in "HH:MM" format
   * @returns Milliseconds until target time
   */
  private diffTimeNow = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    
    const now = new Date()
    const target = new Date()
    
    target.setHours(hours, minutes, 0, 0)
    
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }
    
    return target.getTime() - now.getTime()
  }
  
  /**
   * Setup aria2 event listeners for download lifecycle
   */
  private setupAria2Listeners = (): void => {
    if (this.aria2ListenersInitialized) {
      return
    }
    this.aria2ListenersInitialized = true
    
    aria2.on("onDownloadComplete", async ({ gid }) => {
      if (!this.enableListener) return
      
      console.log(`[Scheduler] Download completed: ${gid}`)
      ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", gid)
      
      await this.deletedDownloadedGidFromDb([gid])
      
      if (this.activeGid === gid) {
        this.activeGid = undefined
      }
      
      if (this.downloadQueue.length) {
        await this.startNextDownload()
      }
      else {
        this.counterDownload = 0
      }
    })
    
    aria2.on("onDownloadPause", ({ gid }) => {
      if (this.enableListener) {
        console.log(`[Scheduler] Download paused: ${gid}`)
      }
    })
    
    aria2.on("onDownloadError", async ({ gid }) => {
      if (!this.enableListener) return
      
      console.log(`[Scheduler] Download failed: ${gid}`)
      
      ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", gid
      )
      
      if (this.activeGid === gid) {
        this.activeGid = undefined
      }
      
      if (this.downloadQueue.length) {
        await this.startNextDownload()
      }
      else {
        this.counterDownload = 0
      }
    })
  }
  
  /**
   * Shutdown the system based on current platform
   */
  private powerOffSystem = (): void => {
    const platform = os.platform()
    const command = SHUTDOWN_COMMANDS[platform]
    
    if (command) {
      exec(command, (error) => {
        if (error) {
          console.error(`[Scheduler] Shutdown failed: ${error.message}`)
        }
      })
    }
  }
  
  /**
   * Stop power save blocker
   */
  private clearKeepAlive = (): void => {
    if (this.blockerId != null) {
      powerSaveBlocker.stop(this.blockerId)
      this.blockerId = null
    }
  }
  
  /**
   * Fetch download queue from database
   */
  private refreshDownloadQueue = async (): Promise<void> => {
    try {
      this.downloadQueue = (await DataSourceRepo.getRepository("scheduler").find()) as TSchedulerDatabase[]
    }
    catch (error) {
      console.error("[Scheduler] Failed to fetch download queue:", error)
      this.downloadQueue = []
    }
  }
  
  /**
   * Start next download in queue
   */
  private startNextDownload = async (): Promise<void> => {
    const nextItem = this.downloadQueue.shift()
    
    if (!nextItem?.gid) {
      return
    }
    
    const { gid } = nextItem
    this.activeGid = gid
    this.counterDownload++
    
    createPopupWindow({
      windowTitle: "download",
      height: 450,
      width: 900,
      hashRoute: `downloadStart/:${gid}`,
      windowId: gid
    })
    
    ipcMain.emit(ACTIONS_CHANNELS.UNPAUSE_BY_GID, "queue", gid)
  }
  
  /**
   * Stop the currently active download
   */
  private stopActiveDownload = (): void => {
    if (this.activeGid) {
      ipcMain.emit(ACTIONS_CHANNELS.STOP_DOWNLOAD_BY_GID, "stop", this.activeGid)
    }
  }
  
  /**
   * Close popup window for active download
   */
  private closeActivePopup = (): void => {
    if (this.activeGid) {
      ipcMain.emit(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, "close", this.activeGid)
    }
  }
  
  /**
   * Delete completed downloads from database
   */
  private deletedDownloadedGidFromDb = async (gids: string[]): Promise<void> => {
    try {
      const repo = DataSourceRepo.getRepository("scheduler")
      const rows = await repo.findBy({ gid: In(gids) })
      await repo.delete({ gid: In(rows.map((r) => r.gid)) })
    }
    catch (error) {
      console.error("[Scheduler] Failed to delete from database:", error)
    }
  }
}