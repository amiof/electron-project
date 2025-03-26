import { TDownloads, TFileDetails, TtellRes } from "@src/types.ts"

export type TDownloaderState = {
  files: string[] | null
  downloadsRow: TDownloads[] | []
  allDownloadsRow: TDownloads[]
  tellActive: TtellRes[] | []
  tellStopped: TtellRes[] | []
  tellWaiting: TtellRes[] | []
  activeDownloads: TtellRes[] | []
  downloadedFilesDetails: Record<string, TFileDetails>
  completedRowFromDB: TtellRes[] | []
}

export type TDownloaderActions = {
  getFiles: (files: string) => void
  getDownloads: () => Promise<void>
  getAllDownloadsRow: () => Promise<void>
  getTellActive: () => Promise<void>
  getTellStopped: () => Promise<void>
  getTellWaiting: () => Promise<void>
  setActiveDataToElectron: (data: TtellRes) => Promise<void>
  getActiveDataFromElectron: () => Promise<void>
  getDownloadedFilesDetails: () => Promise<void>
  getCompletedRowFromDB: () => Promise<void>
}
export type TDownloaderStore = TDownloaderState & TDownloaderActions
