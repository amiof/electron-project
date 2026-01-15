import { resMetadataUrls, TDownloads, TFileDetails, TGetGlobalStateResponse, TtellRes } from "@src/types.ts"
import { TAria2Config, TNotificationDetailes, TProxyConfig, TTorrentConfig } from "@src/store/storeType.ts"
import { TAddLinkOptions } from "@components/addLinkPopup/store/addLinkStoreType.ts"

export interface IElectronAPI {
  addDownload: (url: string) => void
  addDownloadDir: (url: string, dir?: string, outFileName?: string, proxyConfig?: TProxyConfig | null, options?: TAddLinkOptions | null) => Promise<string>
  getDownloads: () => Promise<TDownloads[] | []>
  addLinkPopup: (id: string) => void
  closePopupWindow: (id: string) => void
  getDataFilesStatus: () => void
  tellActive: () => Promise<TtellRes[]>
  tellStopped: () => Promise<TtellRes[]>
  tellWaiting: () => Promise<TtellRes[]>
  getGlobalStates: () => Promise<TGetGlobalStateResponse>
  addDownloadPopup: (id: string) => void
  getTellStatus: (gid: string) => Promise<TtellRes>
  setActiveDownloadData: (data: TtellRes) => void
  getActiveDownloadData: () => Promise<TtellRes[]>
  onDataChange: (callback: (response: Promise<TtellRes>) => void) => void;
  getDownloadedFilesDetails: () => Promise<TFileDetails[]>
  addLinkToDB: (downloadRow: TtellRes) => Promise<unknown>
  updateDownloadRowStatus: (gid: string, downloadRow: TtellRes) => Promise<TtellRes>
  getCompletedRowFromDB: () => Promise<TtellRes[]>
  stopDownloadByGid: (gid: string) => Promise<unknown>
  unPauseAll: () => Promise<unknown>,
  unPauseByGid: (gid: string) => void,
  stopAllDownloads: () => void,
  removeDownloadByGid: (gid: string) => void
  openFolder: (path: string) => void
  openOptionsPopup: (id: string) => Promise<string>
  setProxyConfig: (config: TProxyConfig) => Promise<unknown>,
  getProxyConfig: () => Promise<TProxyConfig>,
  setAria2Config: (config: TAria2Config) => Promise<unknown>,
  getAria2Config: () => Promise<TAria2Config>,
  selectStorageDirectory: () => Promise<unknown>,
  getSelectedStorageDirectory: () => Promise<string>,
  setSelectedStorageDirectory: (basePath: string | null) => Promise<void>,
  showNotification: (notif: TNotificationDetailes) => Promise<void>,
  getTorrentConfig: () => Promise<TTorrentConfig>,
  setTorrentConfig: (config: TTorrentConfig) => Promise<unknown>,
  getMetadataUrls: (url: string) => Promise<resMetadataUrls>,
  
}


declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
