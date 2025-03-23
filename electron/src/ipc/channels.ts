export const DOWNLOAD_CHANNELS = {
  ADD_DOWNLOAD_LINK: "add-download-dir"
}
export const GET_DATA_CHANNELS = {
  GET_DOWNLOADS: "get-downloads",
  GET_TELL_STATUS: "get-tell-status",
  GET_GLOBAL_STATE: "get-global-state",
  SET_DOWNLOAD_DATA_ACTIVE: "set-download-data-active", //for set sended data from front
  DATA_CHANGE: "data-change", // for add event when change a data in popup
  GET_DOWNLOAD_DATA_ACTIVE: "get-download-data-active" //for get data send from front
}

export const POPUP_CHANNELS = {
  ADD_LINK_POPUP: "add-link-popup",
  CLOSE_POPUP_WINDOW: "close-popup",
  POPUP_START_DOWNLOAD: "popup-start-download"
}