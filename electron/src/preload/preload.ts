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
  addDownloadDir: (url: string, dir?: string) => void;
  onAria2cResponse: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
  removeAria2cListener: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
  getDataFilesStatus: () => void,
  closePopupWindow: () => void,
  tellActive: () => Promise<unknown>;
  tellStopped: () => Promise<unknown>;
  tellWaiting: () => Promise<unknown>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

// Expose only specific functions to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  addDownloadDir: async (url: string, dir?: string) => await ipcRenderer.invoke("add-download-dir", url, dir),
  getDownloads: () => ipcRenderer.invoke("get-downloads"),
  addLinkPopup: () => ipcRenderer.send("add-link-popup"),
  closePopupWindow: () => ipcRenderer.send("close-popup"),
  getDataFilesStatus: () => ipcRenderer.invoke("get-data-status"),
  tellActive: () => ipcRenderer.invoke("tell-active"),
  tellStopped: () => ipcRenderer.invoke("tell-stoped"),
  tellWaiting: () => ipcRenderer.invoke("tell-waiting")
})
