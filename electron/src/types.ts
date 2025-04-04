export type TFileDetails = {
  name: string;
  path: string;
  size: number; // in bytes
  createdAt: Date;
  modifiedAt: Date;
  isDirectory: boolean;
}


// type for download db
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
  numPieces: string
  pieceLength: string
  status: STATUS_TYPE
  totalLength: string
  uploadLength: string
  createdAt?: Date
}

// aria2 methods

export enum Aria2Methods {
  // General Methods
  ADD_URI = "aria2.addUri",
  ADD_TORRENT = "aria2.addTorrent",
  ADD_METALINK = "aria2.addMetalink",
  REMOVE = "aria2.remove",
  FORCE_REMOVE = "aria2.forceRemove",
  PAUSE = "aria2.pause",
  PAUSE_ALL = "aria2.pauseAll",
  FORCE_PAUSE = "aria2.forcePause",
  FORCE_PAUSE_ALL = "aria2.forcePauseAll",
  UNPAUSE = "aria2.unpause",
  UNPAUSE_ALL = "aria2.unpauseAll",
  
  // Status Retrieval Methods
  TELL_STATUS = "aria2.tellStatus",
  GET_URIS = "aria2.getUris",
  GET_FILES = "aria2.getFiles",
  GET_SERVERS = "aria2.getServers",
  TELL_ACTIVE = "aria2.tellActive",
  TELL_WAITING = "aria2.tellWaiting",
  TELL_STOPPED = "aria2.tellStopped",
  
  // Global Statistics Methods
  GET_GLOBAL_STAT = "aria2.getGlobalStat",
  
  // Session Management Methods
  SHUTDOWN = "aria2.shutdown",
  FORCE_SHUTDOWN = "aria2.forceShutdown",
  SAVE_SESSION = "aria2.saveSession",
  
  // Configuration Methods
  CHANGE_POSITION = "aria2.changePosition",
  CHANGE_URI = "aria2.changeUri",
  GET_OPTION = "aria2.getOption",
  CHANGE_OPTION = "aria2.changeOption",
  GET_GLOBAL_OPTION = "aria2.getGlobalOption",
  CHANGE_GLOBAL_OPTION = "aria2.changeGlobalOption",
  
  // System Information Methods
  SYSTEM_MULTICALL = "system.multicall",
  SYSTEM_LIST_METHODS = "system.listMethods",
  SYSTEM_LIST_NOTIFICATIONS = "system.listNotifications",
}