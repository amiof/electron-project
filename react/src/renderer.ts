import { TDownloads } from "@src/types.ts"

export interface IElectronAPI {
    addDownload: (url: string) => void;
    addDownloadDir: (url: string, dir?: string) => void;
    getDownloads: () => Promise<TDownloads[] | []>
    addLinkPopup: () => void
    closePopupWindow: () => void,
    // onAria2cResponse: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
    // removeAria2cListener:(callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
    tellActive: () => void;
    tellStopped: () => void;
    tellWaiting: () => void;
}


declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
