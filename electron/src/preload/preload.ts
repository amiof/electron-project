import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

interface Aria2cResponse {
  jsonrpc: "2.0";
  id: string;
  result?: any; //  Consider making this more specific if you know the structure
  error?: {
    code: number;
    message: string;
  };
}

// Define a type for the exposed API in the renderer
interface ElectronAPI {
  addDownload: (url: string) => void;
  addDownloadDir: (url: string, dir?: string) => void;
  onAria2cResponse: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
  removeAria2cListener: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
  tellActive: () => void;
  tellStopped: () => void;
  tellWaiting: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// Expose only specific functions to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  addDownload: (url: string) => ipcRenderer.send("add-download", url),
  addDownloadDir: (url: string, dir?: string) => ipcRenderer.send("add-download-dir", url, dir),
  getDownloads: () => ipcRenderer.invoke("get-downloads"),
  addLinkPopup: () => ipcRenderer.send("add-link-popup"),
  // onAria2cResponse: (callback) => ipcRenderer.on('aria2c-response', callback),
  // removeAria2cListener:(callback) => ipcRenderer.removeListener('aria2c-response', callback),
  tellActive: () => ipcRenderer.send("tell-active"),
  tellStopped: () => ipcRenderer.send("tell-stoped"),
  tellWaiting: () => ipcRenderer.send("tell-waiting")
})
