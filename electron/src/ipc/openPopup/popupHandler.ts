import { ipcMain, IpcMainEvent } from "electron"
import { POPUP_CHANNELS } from "../channels"

const ipcPopupHandler = () => {
  
  ipcMain.on(POPUP_CHANNELS.ADD_LINK_POPUP, (event: IpcMainEvent) => {
    console.log("tesssssssssst")
    console.log(event)
  })
  
}
export default ipcPopupHandler