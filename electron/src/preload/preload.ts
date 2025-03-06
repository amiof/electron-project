import { contextBridge, ipcRenderer } from "electron"
import "./types"
import { IPC_DOWNLOAD_CHANNELS, IPC_GETDATA_CHANNELS } from "../ipc/utils"

// Expose only specific functions to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    addDownload: (url: string) => ipcRenderer.send('add-download', url),
    addDownloadDir: (url: string, dir?: string) => ipcRenderer.send(IPC_DOWNLOAD_CHANNELS.ADD_DOWNLOAD_DIR, url, dir),
    getDownloads: () => ipcRenderer.invoke(IPC_GETDATA_CHANNELS.GET_DOWNLOAD),
    // onAria2cResponse: (callback) => ipcRenderer.on('aria2c-response', callback),
    // removeAria2cListener:(callback) => ipcRenderer.removeListener('aria2c-response', callback),
    tellActive: () => ipcRenderer.send('tell-active'),
    tellStopped: () => ipcRenderer.send('tell-stoped'),
    tellWaiting: () => ipcRenderer.send('tell-waiting'),
});
