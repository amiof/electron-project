import { ipcMain, IpcMainEvent } from "electron"
import { POPUP_CHANNELS } from "../channels"
import { createPopupWindow } from "../utils"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

const ipcPopupHandler = () => {
  ipcMain.on(POPUP_CHANNELS.ADD_LINK_POPUP, (event: IpcMainEvent, id) => {
    createPopupWindow({ windowTitle: "addLink", height: 470, width: 650, hashRoute: `popup/:${id}`, windowId: id })
  })

  ipcMain.handle(POPUP_CHANNELS.POPUP_START_DOWNLOAD, (event: IpcMainInvokeEvent, id, windowTitle) => {
    createPopupWindow({
      windowTitle: windowTitle.trim() ? windowTitle : "download",
      height: 400,
      width: 900,
      hashRoute: `downloadStart/:${id}`,
      windowId: id
    })
    return id
  })
  
  ipcMain.on(POPUP_CHANNELS.POPUP_OPEN_OPTIONS, (event: IpcMainInvokeEvent, id) => {
    createPopupWindow({
      windowTitle: "options",
      height: 500,
      width: 750,
      hashRoute: `options/:${id}`,
      windowId: id
    })
  })
  
  ipcMain.on(POPUP_CHANNELS.POPUP_OPEN_SCHEDULER, (event: IpcMainInvokeEvent, id) => {
    console.log(id)
    createPopupWindow({
      windowTitle: "scheduler",
      height: 350,
      width: 400,
      hashRoute: `scheduler/:${id}`,
      windowId: id
    })
  })
  ipcMain.on(POPUP_CHANNELS.POPUP_OPEN_SHARE, (event: IpcMainInvokeEvent, id) => {
    createPopupWindow({
      windowTitle: "share",
      height: 500,
      width: 600,
      hashRoute: `share/:${id}`,
      windowId: id
    })
  })
}
export default ipcPopupHandler
