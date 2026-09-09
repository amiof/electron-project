import { ipcMain } from "electron"
import { SHARE_CHANNELS } from "../channels"

// Temporary storage for selected rows to share between windows
let selectedRowsForShare: unknown[] = []

const ipcShareHandler = () => {
  ipcMain.on(SHARE_CHANNELS.SET_SELECTED_ROWS_FOR_SHARE, (_, rows) => {
    selectedRowsForShare = rows || []
  })
  
  ipcMain.handle(SHARE_CHANNELS.GET_SELECTED_ROWS_FOR_SHARE, () => {
    return selectedRowsForShare
  })
}

export default ipcShareHandler