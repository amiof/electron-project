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
  selectedRows: TDownloads[] | []
  searchValue: string
  sidebarSelectedLabel: string
  downloadsGroupByLabel: Record<string, TDownloads[]>
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
  setSelectedRow: (Rows: TDownloads[]) => void
  setSearchValue: (text: string) => void
  setSidebarSelectedLabel: (label: string) => void
}
export type TDownloaderStore = TDownloaderState & TDownloaderActions

export type TProxyConfig = {
  proxyStatus: boolean
  ip: string
  port: string
  proxyUserName?: string
  proxyPassword?: string
  proxyType: "http" | "socks"
}

export type TAria2Config = {
  maxConnection: string
  maxConnectionSplit: string
  maxDownloadLimit: string
  dnsServer: string
  minSplitSize: string
  connectTimeout: string
  
}

export type TNotificationDetailes = {
  title: string
  body: string
}

export type TTorrentConfig = {
  enableDht: boolean,
  enableDht6: boolean
  enableLpd: boolean
  enablePeerExchange: boolean
  maxPeers: string
  requestPeerSpeedLimit: string
  seedTime: string
  seedRatio: string
  stopTimeout: string
  maxOverallUploadLimit: string
  maxUploadLimit: string
  maxOverallDownloadLimit: string
  tracker: null | string
}