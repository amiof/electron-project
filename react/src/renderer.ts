import { TDownloads } from "@src/types.ts"

interface ElectronAPI {
    addDownload: (url: string) => void;
    addDownloadDir: (url: string, dir?: string) => void;
    getDownloads: () => Promise<TDownloads[] | []>
    addLinkPopup: () => void
    // onAria2cResponse: (callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
    // removeAria2cListener:(callback: (event: IpcRendererEvent, response: Aria2cResponse) => void) => void;
    tellActive: () => void;
    tellStopped: () => void;
    tellWaiting: () => void;
}


declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
