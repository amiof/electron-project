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
  getTellStatus: (gid: string) => Promise<unknown>,
  getGlobalStates: () => Promise<unknown>,
  addDownloadPopup: (id: string) => void,
  addLinkPopup: (id: string) => void,
  closePopupWindow: (id: string) => void,
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
  addLinkPopup: (id: string) => ipcRenderer.send("add-link-popup", id),
  closePopupWindow: (id: string) => ipcRenderer.send("close-popup", id),
  getTellStatus: (gid: string) => ipcRenderer.invoke("get-tell-status", gid),
  addDownloadPopup: (id: string) => ipcRenderer.invoke("popup-start-download", id),
  getGlobalStates: () => ipcRenderer.invoke("get-global-state"),
  tellActive: () => ipcRenderer.invoke("tell-active"),
  tellStopped: () => ipcRenderer.invoke("tell-stoped"),
  tellWaiting: () => ipcRenderer.invoke("tell-waiting")
})
