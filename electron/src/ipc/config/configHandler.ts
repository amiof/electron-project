import { dialog, ipcMain } from "electron"
import { CONFIG_CHANNELS } from "../channels"
import { TAria2Config, TProxyConfig } from "../../types"
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
  
  
}