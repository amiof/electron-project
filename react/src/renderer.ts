import { TDownloads, TFileDetails, TGetGlobalStateResponse, TtellRes } from "@src/types.ts"

export interface IElectronAPI {
  addDownload: (url: string) => void
  addDownloadDir: (url: string, dir?: string) => Promise<string>
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
}


declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
