import { ipcMain, Notification } from "electron"
import { UTILS_CHANNELS } from "../channels"
import { TNotificationDetailes } from "../../types"
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent

export const ipcUtilsHandler = () => {
  
  ipcMain.handle(UTILS_CHANNELS.SHOW_NOTIFICATION, (_event: IpcMainInvokeEvent, notifDetailes: TNotificationDetailes) => {
    
    const { title, body } = notifDetailes
    
    const notif = new Notification({
      title: title,
      body: body
      // You can also add an icon
      // icon: path.join(__dirname, 'icon.png')
    })
    notif.show()
    // Handle click events
    // notif.on("click", () => {
    //   console.log("User clicked the notification")
    //   // e.g., focus your main window
    // })
  })
  
}
