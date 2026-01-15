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
  POPUP_START_DOWNLOAD: "popup-start-download",
  POPUP_OPEN_OPTIONS: "open-options-popup"
}

export const ACTIONS_CHANNELS = {
  STOP_DOWNLOAD_BY_GID: "stop-download-by-gid",
  UNPAUSE_ALL: "unpause-all",
  UNPAUSE_BY_GID: "unpause-By-gid",
  STOP_ALL_DOWNLOADS: "stop-allDownloads",
  REMOVE_DOWNLOAD_BY_GID: "remove-download-by-gid",
  REMOVE_SELECTED_DOWNLOADS: "remove-selected-downloads",
  OPEN_FOLDER: "open-folder"
}
export const CONFIG_CHANNELS = {
  SET_PROXY_CONFIG: "set-proxy-config",
  GET_PROXY_CONFIG: "get-proxy-config",
  GET_ARIA2_CONFIG: "get-aria2-config",
  SET_ARIA2_CONFIG: "set-aria2-config",
  SELECT_STORAGE_DIR: "select-storage-dir",
  GET_SELECTED_STORAGE_CONF_DIR: "get-selected=storage-config-dir",
  SET_SELECTED_STORAGE_DIR: "set-selected-storage-directory",
  GET_TORRENTS_CONF: "get-torrents-config",
  SET_TORRENTS_CONF: "set-torrents-config"
}

export const UTILS_CHANNELS = {
  SHOW_NOTIFICATION: "show-notification",
  GET_METADATA_URLS: "get-metadata-urls"
}
