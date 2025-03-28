export const DOWNLOAD_CHANNELS = {
  ADD_DOWNLOAD_LINK: "add-download-dir"
}
export const GET_DATA_CHANNELS = {
  GET_DOWNLOADS: "get-downloads",
  GET_TELL_STATUS: "get-tell-status",
  GET_GLOBAL_STATE: "get-global-state",
  SET_DOWNLOAD_DATA_ACTIVE: "set-download-data-active", //for set sended data from front
  DATA_CHANGE: "data-change", // for add event when change a data in popup
  GET_DOWNLOAD_DATA_ACTIVE: "get-download-data-active", //for get data send from front
  CHECK_DOWNLOADED_FILES_DETAILS: "get-downloaded-files-details", // for get createAt files
  ADD_LINK_TO_DB: "add-link-to-db",
  UPDATE_DOWNLOAD_ROW_STATUS: "update-downloadRow-status",
  GET_COMPLETED_ROW_FROM_DB: "get-completed-row-from-db"
}

export const POPUP_CHANNELS = {
  ADD_LINK_POPUP: "add-link-popup",
  CLOSE_POPUP_WINDOW: "close-popup",
  POPUP_START_DOWNLOAD: "popup-start-download"
}

export const ACTIONS_CHANNELS = {
  STOP_DOWNLOAD_BY_GID: "stop-download-by-gid",
  UNPAUSE_ALL: "unpause-all",
  UNPAUSE_BY_GID: "unpause-By-gid",
  STOP_ALL_DOWNLOADS: "stop-allDownloads",
  REMOVE_DOWNLOAD_BY_GID: "remove-download-by-gid"
}