import { dialog, ipcMain } from "electron"
import { CONFIG_CHANNELS } from "../channels"
import { TAria2Config, TProxyConfig, TTorrentConfig } from "../../types"
import { electronStore } from "../../store/electronStore"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

export const ipcConfigHandler = () => {
  ipcMain.handle(CONFIG_CHANNELS.GET_PROXY_CONFIG, async (_event: IpcMainInvokeEvent) => {
    return electronStore.get("proxyConfig")
  })
  ipcMain.handle(CONFIG_CHANNELS.SET_PROXY_CONFIG, async (_event: IpcMainInvokeEvent, config: TProxyConfig) => {
    electronStore.set("proxyConfig", config)
  })
  
  ipcMain.handle(CONFIG_CHANNELS.GET_ARIA2_CONFIG, async (_event: IpcMainInvokeEvent) => {
    return electronStore.get("aria2Config")
  })
  
  ipcMain.handle(CONFIG_CHANNELS.SET_ARIA2_CONFIG, async (_event: IpcMainInvokeEvent, config: TAria2Config) => {
    electronStore.set("aria2Config", config)
  })
  ipcMain.handle(CONFIG_CHANNELS.SELECT_STORAGE_DIR, async (_event: IpcMainInvokeEvent) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      title: "Select Storage Directory"
    })
    
    if (result.canceled) {
      return null
    }
    
    return result.filePaths[0]
  })
  
  ipcMain.handle(CONFIG_CHANNELS.GET_SELECTED_STORAGE_CONF_DIR, async (_event: IpcMainInvokeEvent) => {
    return electronStore.get("selectedStorageDirectory")
  })
  
  ipcMain.handle(CONFIG_CHANNELS.SET_SELECTED_STORAGE_DIR, async (_event: IpcMainInvokeEvent, basePath: string) => {
    return electronStore.set("selectedStorageDirectory", basePath)
  })
  
  ipcMain.handle(CONFIG_CHANNELS.GET_TORRENTS_CONF, async (_event: IpcMainInvokeEvent) => {
    return electronStore.get("torrentConfig")
  })
  
  ipcMain.handle(CONFIG_CHANNELS.SET_TORRENTS_CONF, async (_event: IpcMainInvokeEvent, config: TTorrentConfig) => {
    return electronStore.set("torrentConfig", config)
  })
  
  ipcMain.handle(
    CONFIG_CHANNELS.SELECT_COOKIE_FILE,
    async (_event: IpcMainInvokeEvent, fileType: "cookie" | "torrent" = "cookie") => {
      const torrentFile = fileType === "torrent"
      const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        title: torrentFile ? "Select Torrent File" : "Select Cookie File",
        filters: torrentFile
          ? [{ name: "Torrent Files", extensions: ["torrent"] }]
          : [
            { name: "Cookie Files", extensions: ["txt", "cookie", "cookies"] },
            { name: "All Files", extensions: ["*"] }
          ]
      })
      
      if (result.canceled) {
        return null
      }
      
      return result.filePaths[0]
    }
  )
}