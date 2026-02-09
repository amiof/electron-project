import { BrowserWindow, ipcMain, IpcMainEvent } from "electron"
import path from "path"
import { POPUP_CHANNELS } from "./channels"

type TCreatePopupWindow = {
  windowTitle: string
  width: number
  height: number
  hashRoute: string
  windowId: string
}

export const createPopupWindow = (arg: TCreatePopupWindow) => {
  const { windowTitle, hashRoute, height, width, windowId } = arg
  let popupWindow: BrowserWindow | null
  popupWindow = new BrowserWindow({
    width: width,
    height: height,
    title: windowTitle,
    resizable: false,
    movable: true,
    alwaysOnTop: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "../", "preload", "preload.js"),
      contextIsolation: true, // Crucial for security
      nodeIntegration: false // Disable node integration in renderer
    }
  })
  
  popupWindow.setContentSize(width, height, true)
  ipcMain.on(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, (event: IpcMainEvent, id: string) => {
    if (popupWindow && id === windowId) {
      popupWindow.close() // Close the popup window
      popupWindow = null // Reset the reference
    }
  })
  popupWindow.setMenuBarVisibility(false)
  const isDev = process.env.NODE_ENV === "development"
  
  const popupURL = isDev
    ? `http://localhost:3000/#/${hashRoute}`
    : `file://${path.join(process.resourcesPath, "react", "dist", "index.html")}#/${hashRoute}`
  popupWindow.loadURL(popupURL)
  
  popupWindow.on("closed", () => {
    popupWindow = null
  })
}


export const iconPathContextMenu = (iconName: string) => {
  
  if (process.env.NODE_ENV === "development") {
    return path.join(__dirname, "..", "..", "..", "assets", `${iconName}`)
  }
  else {
    return path.join(process.resourcesPath, "assets", `${iconName}`)
  }
}