import { ipcMain, IpcMainEvent } from "electron"
import { POPUP_CHANNELS } from "../channels"
import { createPopupWindow } from "../utils"

const ipcPopupHandler = () => {
  
  ipcMain.on(POPUP_CHANNELS.ADD_LINK_POPUP, (event: IpcMainEvent) => {
    createPopupWindow({ windowTitle: "addLink", height: 300, width: 700, hashRoute: "popup" })
  })
  
  
}
export default ipcPopupHandler