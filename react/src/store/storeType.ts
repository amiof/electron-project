import { TDownloads } from "@src/types.ts"

export type TDownloaderState = {
  files: string[] | null
  downloadsRow: TDownloads[] | []
}

export type TDownloaderActions = {
  getFiles: (files: string) => void
  getDownloads: () => Promise<void>
}

export type TDownloaderStore = TDownloaderState & TDownloaderActions
