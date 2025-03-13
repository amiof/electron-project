import { BrowserWindow } from "electron"
import path from "path"

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
      contextIsolation: true, // Crucial for security
      nodeIntegration: false // Disable node integration in renderer
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