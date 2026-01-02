import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import { STATUS_TYPE, TAria2Config, TNotificationDetailes, TProxyConfig, TtellRes } from "../types"

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
  setActiveDownloadData: (id: string) => void;
  getActiveDownloadData: () => Promise<unknown>;
  onDataChange: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
  getDownloadedFilesDetails: () => Promise<unknown>
  addLinkToDB: (downloadRow: TtellRes) => Promise<unknown>
  updateDownloadRowStatus: (gid: string, downloadRow: TtellRes) => Promise<unknown>
  getCompletedRowFromDB: () => Promise<unknown>
  stopDownloadByGid: (gid: string) => Promise<unknown>,
  unPauseAll: () => Promise<unknown>,
  unPauseByGid: (gid: string) => void,
  stopAllDownloads: () => void,
  removeDownloadByGid: (gid: string) => void
  openFolder: (path: string) => void
  openOptionsPopup: (id: string) => Promise<unknown>,
  setProxyConfig: (config: TProxyConfig) => Promise<unknown>,
  getProxyConfig: () => Promise<unknown>,
  setAria2Config: (config: TAria2Config) => Promise<unknown>,
  getAria2Config: () => Promise<unknown>,
  selectStorageDirectory: () => Promise<unknown>,
  getSelectedStorageDirectory: () => Promise<string>,
  setSelectedStorageDirectory: (basePath: string) => Promise<void>,
  showNotification: (notif: TNotificationDetailes) => Promise<void>,
  
  
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
  tellWaiting: () => ipcRenderer.invoke("tell-waiting"),
  
  //popup
  openOptionsPopup: (id: string) => ipcRenderer.invoke("open-options-popup", id),
  
  // update main window in start download
  setActiveDownloadData: (data: unknown) => ipcRenderer.send("set-download-data-active", data),
  getActiveDownloadData: () => ipcRenderer.invoke("get-download-data-active"),
  onDataChange: (callback: (data: string) => void) => {
    ipcRenderer.on("data-change", (_event, data) => callback(data))
  },
  getDownloadedFilesDetails: () => ipcRenderer.invoke("get-downloaded-files-details"),
  
  // use DataBase
  addLinkToDB: (downloadRow: TtellRes) => ipcRenderer.invoke("add-link-to-db", downloadRow),
  updateDownloadRowStatus: (gid: string, downloadRow: STATUS_TYPE) => ipcRenderer.invoke("update-downloadRow-status", gid, downloadRow),
  getCompletedRowFromDB: () => ipcRenderer.invoke("get-completed-row-from-db"),
  //action handler
  stopDownloadByGid: (gid: string) => ipcRenderer.invoke("stop-download-by-gid", gid),
  unPauseAll: () => ipcRenderer.invoke("unpause-all"),
  unPauseByGid: (gid: string) => ipcRenderer.send("unpause-By-gid", gid),
  stopAllDownloads: () => ipcRenderer.send("stop-allDownloads"),
  removeDownloadByGid: (gid: string) => ipcRenderer.send("remove-download-by-gid", gid),
  openFolder: (path: string) => ipcRenderer.send("open-folder", path),
  
  //config
  setProxyConfig: (config: TProxyConfig) => ipcRenderer.invoke("set-proxy-config", config),
  getProxyConfig: () => ipcRenderer.invoke("get-proxy-config"),
  setAria2Config: (config: TAria2Config) => ipcRenderer.invoke("set-aria2-config", config),
  getAria2Config: () => ipcRenderer.invoke("get-aria2-config"),
  selectStorageDirectory: () => ipcRenderer.invoke("select-storage-dir"),
  getSelectedStorageDirectory: () => ipcRenderer.invoke("get-selected=storage-config-dir"),
  setSelectedStorageDirectory: (basePath: string) => ipcRenderer.invoke("set-selected-storage-directory", basePath),
  
  //utils
  showNotification: (notifDetailes: TNotificationDetailes) => ipcRenderer.invoke("show-notification", notifDetailes)
  
})
