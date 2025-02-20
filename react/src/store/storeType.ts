
export type TDownloaderState = {
  files: string[] | null
}

export type TDownloaderActions = {
  getFiles: (files: string) => void
}

export type TDownloaderStore = TDownloaderState & TDownloaderActions
