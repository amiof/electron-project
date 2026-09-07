import { ipcMain } from "electron"
import { DownloadRepo, TorrentRepo } from "../../database/database"
import { aria2 } from "../../main"
import { STATUS_TYPE, TDownloads } from "../../types"
import { EDIT_DOWNLOAD_CHANNELS } from "../channels"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

let selectedDownloadForEdit: TDownloads | null = null
type OptionOverrides = Record<string, string>

function parseOverrides(value: OptionOverrides | string | null | undefined): OptionOverrides {
  if (!value) return {}
  if (typeof value !== "string") return value
  try {
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as OptionOverrides) : {}
  }
  catch (_) {
    return {}
  }
}

function getRepoForDownload(download: TDownloads | null) {
  if (download?.isTorrent || "infoHash" in (download || {})) {
    return TorrentRepo
  }
  return DownloadRepo
}

export async function reApplyOptionOverrides(gid: string): Promise<void> {
  try {
    const download = DownloadRepo.findOneBy({ gid }) as any
    let overrides = download?.optionOverrides
    
    if (!overrides || Object.keys(overrides).length === 0) {
      const torrent = TorrentRepo.findOneBy({ gid }) as any
      overrides = torrent?.optionOverrides
    }
    
    if (!overrides || Object.keys(overrides).length === 0) return
    
    const status = (await aria2.sendAria2cRequest("tellStatus", [gid])) as { status?: string }
    const wasActive = status?.status === "active"
    
    if (wasActive) {
      await aria2.sendAria2cRequest("pause", [gid])
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    
    await aria2.sendAria2cRequest("changeOption", [gid, overrides])
    
    if (wasActive) {
      await aria2.sendAria2cRequest("unpause", [gid])
    }
    
    console.log(`[EditDownload] Re-applied ${Object.keys(overrides).length} overrides to gid ${gid}`)
  }
  catch (error) {
    console.error(`[EditDownload] Failed to re-apply overrides for gid ${gid}:`, error)
  }
}

export const ipcEditDownloadHandler = () => {
  ipcMain.on(EDIT_DOWNLOAD_CHANNELS.SET_SELECTED_DOWNLOAD_FOR_EDIT, (_, download: TDownloads | null) => {
    selectedDownloadForEdit = download
  })
  
  ipcMain.handle(EDIT_DOWNLOAD_CHANNELS.GET_SELECTED_DOWNLOAD_FOR_EDIT, () => {
    return selectedDownloadForEdit
  })
  
  ipcMain.handle(EDIT_DOWNLOAD_CHANNELS.GET_DOWNLOAD_OPTIONS, async (_event: IpcMainInvokeEvent, gid: string) => {
    try {
      return await aria2.sendAria2cRequest("getOption", [gid])
    }
    catch (error) {
      console.error("[EditDownload] Failed to get options:", error)
      return null
    }
  })
  
  ipcMain.handle(EDIT_DOWNLOAD_CHANNELS.GET_DOWNLOAD_INFO, async (_event: IpcMainInvokeEvent, gid: string) => {
    try {
      return await aria2.sendAria2cRequest("tellStatus", [gid])
    }
    catch (error) {
      console.error("[EditDownload] Failed to get download info:", error)
      return null
    }
  })
  
  ipcMain.handle(
    EDIT_DOWNLOAD_CHANNELS.CHANGE_DOWNLOAD_OPTIONS,
    async (_event: IpcMainInvokeEvent, gid: string, options: Record<string, string>) => {
      try {
        return await aria2.sendAria2cRequest("changeOption", [gid, options])
      }
      catch (error) {
        console.error("[EditDownload] Failed to change options:", error)
        return null
      }
    }
  )
  
  ipcMain.handle(EDIT_DOWNLOAD_CHANNELS.GET_OPTION_OVERRIDES, async (_event: IpcMainInvokeEvent, gid: string) => {
    try {
      /** Use raw query to avoid TypeORM transformer issues with old data */
      const rawDownload = DownloadRepo.findOne({ where: { gid }, select: ["optionOverrides"] }) as any
      let overrides: OptionOverrides = {}
      if (rawDownload?.optionOverrides) {
        try {
          overrides = parseOverrides(rawDownload.optionOverrides)
        }
        catch (error) {
          console.error("[EditDownload] Failed to pause5:", error)
        }
      }
      
      if (Object.keys(overrides).length === 0) {
        const rawTorrent = TorrentRepo.findOne({ where: { gid }, select: ["optionOverrides"] }) as any
        if (rawTorrent?.optionOverrides) {
          try {
            overrides = parseOverrides(rawTorrent.optionOverrides)
          }
          catch (error) {
            console.error("[EditDownload] Failed to pause6:", error)
          }
        }
      }
      
      return overrides
    }
    catch (error) {
      console.error("[EditDownload] Failed to get option overrides:", error)
      return {}
    }
  })
  
  ipcMain.handle(
    EDIT_DOWNLOAD_CHANNELS.SAVE_OPTION_OVERRIDES,
    async (_event: IpcMainInvokeEvent, gid: string, overrides: Record<string, string>) => {
      try {
        const stored = selectedDownloadForEdit
        const repo = getRepoForDownload(stored)
        
        const status = (await aria2.sendAria2cRequest("tellStatus", [gid])) as { status?: string }
        const wasActive = status?.status === "active"
        const isError = status?.status === "error"
        
        /** Pause if active or error — changeOption only works on paused downloads */
        if (wasActive || isError) {
          try {
            await aria2.sendAria2cRequest("pause", [gid])
          }
          catch (error) {
            console.error("[EditDownload] Failed to pause1:", error)
          }
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
        
        /** Separate empty values (for clearing) from non-empty values (for setting) */
        const toApply: Record<string, string> = {}
        const toClear: Record<string, string> = {}
        for (const [key, val] of Object.entries(overrides)) {
          if (val === "" || val === undefined || val === null) {
            toClear[key] = ""
          }
          else {
            toApply[key] = val
          }
        }
        if (Object.keys(toApply).length > 0) {
          await aria2.sendAria2cRequest("changeOption", [gid, toApply])
        }
        if (Object.keys(toClear).length > 0) {
          await aria2.sendAria2cRequest("changeOption", [gid, toClear])
        }
        
        /** Merge with existing then stringify for DB */
        const rawExisting = repo.findOne({ where: { gid }, select: ["optionOverrides"] }) as any
        let existingOverrides: OptionOverrides = {}
        if (rawExisting?.optionOverrides) {
          try {
            existingOverrides = parseOverrides(rawExisting.optionOverrides)
          }
          catch (error) {
            console.error("[EditDownload] Failed to pause2:", error)
          }
        }
        const merged = { ...existingOverrides, ...overrides }
        for (const key of Object.keys(merged)) {
          if (merged[key] === "" || merged[key] === undefined || merged[key] === null) {
            delete merged[key]
          }
        }
        repo.update({ gid }, { optionOverrides: merged })
        
        if (wasActive) {
          await aria2.sendAria2cRequest("unpause", [gid])
        }
        /** If was error, keep paused so user can resume manually */
        
        return true
      }
      catch (error) {
        console.error("[EditDownload] Failed to save option overrides:", error)
        return false
      }
    }
  )
  
  ipcMain.handle(
    EDIT_DOWNLOAD_CHANNELS.RESET_DOWNLOAD_OPTION,
    async (_event: IpcMainInvokeEvent, gid: string, optionKey: string) => {
      try {
        const stored = selectedDownloadForEdit
        const repo = getRepoForDownload(stored)
        const rawEntity = repo.findOne({ where: { gid }, select: ["optionOverrides"] }) as any
        let currentOverrides: OptionOverrides = {}
        if (rawEntity?.optionOverrides) {
          try {
            currentOverrides = parseOverrides(rawEntity.optionOverrides)
          }
          catch (error) {
            console.error("[EditDownload] Failed to pause3:", error)
          }
        }
        if (Object.keys(currentOverrides).length === 0) return true
        
        const updated = { ...currentOverrides }
        delete updated[optionKey]
        repo.update({ gid }, { optionOverrides: updated })
        
        const globalOptions = (await aria2.sendAria2cRequest("getOption", [gid])) as Record<string, string>
        const globalValue = globalOptions[optionKey]
        if (globalValue !== undefined) {
          const status = (await aria2.sendAria2cRequest("tellStatus", [gid])) as { status?: string }
          const wasActive = status?.status === "active"
          
          if (wasActive) {
            await aria2.sendAria2cRequest("pause", [gid])
            await new Promise((resolve) => setTimeout(resolve, 300))
          }
          
          await aria2.sendAria2cRequest("changeOption", [gid, { [optionKey]: globalValue }])
          
          if (wasActive) {
            await aria2.sendAria2cRequest("unpause", [gid])
          }
        }
        
        return true
      }
      catch (error) {
        console.error("[EditDownload] Failed to reset option:", error)
        return false
      }
    }
  )
  
  ipcMain.handle(
    EDIT_DOWNLOAD_CHANNELS.CHANGE_DOWNLOAD_URL,
    async (_event: IpcMainInvokeEvent, oldGid: string, newUrl: string) => {
      try {
        const options = ((await aria2.sendAria2cRequest("getOption", [oldGid])) as Record<string, string>) || {}
        
        let dbOverrides: Record<string, string> = {}
        let dbRow: any = DownloadRepo.findOneBy({ gid: oldGid })
        if (dbRow?.optionOverrides) {
          dbOverrides = dbRow.optionOverrides
        }
        else {
          const torrentRow = TorrentRepo.findOneBy({ gid: oldGid }) as any
          if (torrentRow?.optionOverrides) {
            dbOverrides = torrentRow.optionOverrides
            dbRow = torrentRow
          }
        }
        
        try {
          await aria2.sendAria2cRequest("remove", [oldGid])
          await aria2.sendAria2cRequest("removeDownloadResult", [oldGid])
        }
        catch (error) {
          console.error("[EditDownload] Failed to pause4:", error)
        }
        
        DownloadRepo.delete({ gid: oldGid })
        TorrentRepo.delete({ gid: oldGid })
        
        const addOptions = { ...options, continue: true }
        const newGid = (await aria2.sendAria2cRequest("addUri", [[newUrl], addOptions])) as string
        
        if (Object.keys(dbOverrides).length > 0) {
          await new Promise((resolve) => setTimeout(resolve, 300))
          await aria2.sendAria2cRequest("changeOption", [newGid, dbOverrides])
        }
        
        const newRow: Record<string, unknown> = {
          gid: newGid,
          dir: options.dir || "",
          totalLength: "0",
          completedLength: "0",
          downloadSpeed: "0",
          uploadLength: "0",
          connections: "0",
          numPieces: options.numPieces || "1",
          pieceLength: options.pieceLength || "1048576",
          bitfield: "",
          errorCode: "0",
          errorMessage: "",
          status: STATUS_TYPE.WAITING,
          files: [],
          schedulerQueue: false,
          optionOverrides: dbOverrides
        }
        DownloadRepo.insert(newRow as Record<string, unknown>)
        
        selectedDownloadForEdit = {
          Gid: newGid,
          FileName: dbRow?.files?.[0]?.path?.split(/[/\\]/).pop() || newUrl.split("/").pop() || newGid,
          Url: newUrl,
          SavePath: options.dir || "",
          Size: "0",
          Status: STATUS_TYPE.WAITING,
          CompletedSize: "0",
          NumberConnections: "0",
          isTorrent: false,
          schedulerQueue: false
        } as TDownloads
        
        console.log(`[EditDownload] Changed URL for ${oldGid} → ${newGid}`)
        return { newGid }
      }
      catch (error) {
        console.error("[EditDownload] Failed to change URL:", error)
        return null
      }
    }
  )
}
