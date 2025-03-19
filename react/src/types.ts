export type TDownloads = {
  Id?: number
  FileName: string
  Url: string
  SavePath: string
  Size: string
  CreatedAt?: Date
  Percentage?: number
  Status?: STATUS_TYPE
  Gid: string
  NumberConnections: string
}

export type TUri = {
  status: "used" | "waiting"
  uri: string
}
export type Tfile = {
  "completedLength": string,
  "index": string,
  "length": string,
  "path": string,
  "selected": string,
  "uris": TUri[]
  
}

export enum STATUS_TYPE {
  WAITING = "waiting",
  ERROR = "error",
  REMOVED = "removed",
  COMPLETE = "complete",
  PAUSED = "paused",
  ACTIVE = "active",
}

export type TtellRes = {
  bitfield: string
  completedLength: string
  connections: string
  dir: string
  downloadSpeed: string
  errorCode: string
  errorMessage: string
  files: Tfile[]
  gid: string
  "numPieces": string
  "pieceLength": string
  "status": STATUS_TYPE
  "totalLength": string
  "uploadLength": string
}
