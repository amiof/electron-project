export type TDownloads = {
  Id?: number
  FileName: string
  Url: string
  SavePath: string
  Size: string
  CreatedAt?: Date
  Percentage?: number
  Status?: DOWNLOAD_STATUS
  Gid: string
  NumberConnections: number
}


enum DOWNLOAD_STATUS {
  ERROR = "error",
  COMPLATED = "complated",
  NOT_STARTED = "not-started",
  DOWNLOAD = "download"
}

