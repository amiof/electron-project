import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import aria2c from "./aria2c"
import { initDatabase } from "./database/database"
import ipcDownloadHandler from "./ipc/download/downloadHandler"
import ipcGetDataHandler from "./ipc/getData/getDataHandler"
import ipcPopupHandler from "./ipc/openPopup/popupHandler"
import { checkAndCreateFolder, checkSessionExists } from "./utils"
import "./store/electronStore"
import { ipcActionsHandler } from "./ipc/actions/actionsHandler"
import { POPUP_CHANNELS } from "./ipc/channels"
import { ipcConfigHandler } from "./ipc/config/configHandler"
import { ipcEditDownloadHandler } from "./ipc/editDownload/editDownloadHandler"
import ipcShareHandler from "./ipc/sahre/shareHandler"
import { ipcSchedulerHandler } from "./ipc/scheduler/scheduler"
import { ipcUtilsHandler } from "./ipc/utils/utils"
import { SchedulerProcess } from "./schedulerProcess/schedulerProcess"

export let mainWindow: BrowserWindow | null

let isQuitting = false

export const schedulers: Record<string, ReturnType<typeof setTimeout> | undefined> = {}

checkSessionExists()

const iconPath = () => {
  if (process.platform === "win32") {
    return path.join(process.resourcesPath, "assets", "icons", "icon.ico")
  } else if (process.platform === "darwin") {
    return path.join(process.resourcesPath, "assets", "icons", "icon.icns")
  } else if (process.platform === "linux") {
    return path.join(process.resourcesPath, "assets", "icons", "512x512.png")
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    title: "shabdiz",
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    roundedCorners: true,
    transparent: true,
    minWidth: 980,
    minHeight: 600,
    resizable: true,
    icon: iconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.setContentSize(1000, 500, true)
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3353")
    const devIconPath = path.join(__dirname, "..", "..", "assets", "icons", "512x512.png")
    mainWindow.setIcon(devIconPath)
  } else {
    if (process.platform === "linux") {
      const linuxIconPath = path.join(process.resourcesPath, "assets", "icons", "512x512.png")
      mainWindow.setIcon(linuxIconPath)
    }

    const indexPath = path.join(process.resourcesPath, "react", "dist", "index.html")
    mainWindow.loadFile(indexPath).catch((err) => console.error("Failed to load index.html:", err))
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// Ensure folders exist before anything else
checkAndCreateFolder()

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

export const aria2 = new aria2c()

export const schedulerInstance = new SchedulerProcess()

// Single entry point: init database → create window → start services → register IPC
app.whenReady().then(async () => {
  // 1. Initialize database BEFORE anything else
  initDatabase()

  // 2. Register window control IPC handlers (no DB dependency)
  ipcMain.on(POPUP_CHANNELS.WINDOW_POPUP_MINIMIZE, (_, id) => {
    if (id) return
    mainWindow?.minimize()
  })

  ipcMain.on(POPUP_CHANNELS.WINDOW_POPUP_MAXIMIZE, (_, id) => {
    if (id) return
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on(POPUP_CHANNELS.CLOSE_MAIN_POPUP, (_, id) => {
    if (id) return
    app.quit()
  })

  // 3. Register all IPC handlers (DB is ready now)
  ipcDownloadHandler()
  ipcGetDataHandler()
  ipcPopupHandler()
  ipcActionsHandler()
  ipcConfigHandler()
  ipcUtilsHandler()
  ipcSchedulerHandler()
  ipcShareHandler()
  ipcEditDownloadHandler()

  // 4. Create window and start services
  createWindow()
  aria2.start()
  schedulerInstance.initScheduler()
  setTimeout(() => aria2.connect(), 1000)

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on("before-quit", async (event) => {
  if (isQuitting) {
    return
  }
  
  event.preventDefault()
  
  isQuitting = true
  
  try {
    await aria2.shutdown()
  }
  catch (error) {
    console.error("Failed to shutdown aria2:", error)
  }
  finally {
    app.quit()
  }
})
