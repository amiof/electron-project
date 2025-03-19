import { TDownloads, TGetGlobalStateResponse, TtellRes } from "@src/types.ts"

export interface IElectronAPI {
  addDownload: (url: string) => void;
  addDownloadDir: (url: string, dir?: string) => Promise<string>;
  getDownloads: () => Promise<TDownloads[] | []>
  addLinkPopup: () => void
  closePopupWindow: () => void,
  getDataFilesStatus: () => void,
  tellActive: () => Promise<TtellRes[]>;
  tellStopped: () => Promise<TtellRes[]>;
  tellWaiting: () => Promise<TtellRes[]>;
  getGlobalStates: () => Promise<TGetGlobalStateResponse>;
}


declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
