import { BrowserWindow, ipcMain } from "electron"
import path from "path"
import { POPUP_CHANNELS } from "./channels"

type TCreatePopupWindow = {
  windowTitle: string
  width: number
  height: number
  hashRoute: string
}

export const createPopupWindow = (arg: TCreatePopupWindow) => {
  const { windowTitle, hashRoute, height, width } = arg
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
  
  ipcMain.on(POPUP_CHANNELS.CLOSE_POPUP_WINDOW, () => {
    if (popupWindow) {
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