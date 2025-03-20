import { ipcMain, IpcMainEvent } from "electron"
import { POPUP_CHANNELS } from "../channels"
import { createPopupWindow } from "../utils"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

const ipcPopupHandler = () => {
  
  ipcMain.on(POPUP_CHANNELS.ADD_LINK_POPUP, (event: IpcMainEvent, id) => {
    createPopupWindow({ windowTitle: "addLink", height: 300, width: 700, hashRoute: `popup/:${id}`, windowId: id })
  })
  
  ipcMain.handle(POPUP_CHANNELS.POPUP_START_DOWNLOAD, (event: IpcMainInvokeEvent, id) => {
    createPopupWindow({
      windowTitle: "download",
      height: 500,
      width: 900,
      hashRoute: `downloadStart/:${id}`,
      windowId: id
    })
    return id
  })
  
  
}
export default ipcPopupHandler