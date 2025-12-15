import { app, BrowserWindow } from "electron"
import path from "path"
import aria2c from "./aria2c"
import { checkAndCreateFolder, checkSessionExists } from "./utils"
import { DataSourceRepo } from "./database/database"
import ipcDownloadHandler from "./ipc/download/downloadHandler"
import ipcGetdataHanlder from "./ipc/getData/getDataHandler"
import ipcPopupHandler from "./ipc/openPopup/popupHandler"
import "./store/electronStore"
import { ipcActionsHandler } from "./ipc/actions/actionsHandler"

export let mainWindow: BrowserWindow | null

checkSessionExists()
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    title: "IDownload",
    height: 700,
    autoHideMenuBar: true,
    minWidth: 1000,
    minHeight: 500,
    resizable: true,
    icon:path.join(__dirname,"..","..","assets","icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload", "preload.js"),
      contextIsolation: true, // Crucial for security
      nodeIntegration: false // Disable node integration in renderer
    }
  })
  
  if (process.env.NODE_ENV === "development") {
    // In development, load the React dev server.
    mainWindow.loadURL("http://localhost:3000")
    // mainWindow.webContents.openDevTools();
  }
  else {
    
    if (process.platform === "linux") {
      const iconPath = path.join(process.resourcesPath, "assets", "icon.png")
      mainWindow.setIcon(iconPath)
    }
    
    // In production, load the built index.html from extraResources.
    // Using process.resourcesPath ensures we reference the correct folder outside the asar.
    const indexPath = path.join(process.resourcesPath, "react", "dist", "index.html")
    // mainWindow.loadFile(indexPath);
    mainWindow.loadFile(indexPath).catch((err) => console.error("Failed to load index.html:", err))
    
  }
  
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

//  create folders for download files
(async () => {
  
  await checkAndCreateFolder()
  await DataSourceRepo.initialize()
  
})()


// app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

export const aria2 = new aria2c()

app.whenReady().then(() => {
  createWindow()
  // startAria2c();
  aria2.start()
  
  // setTimeout(connectToAria2c, 1000);
  setTimeout(() => aria2.connect(), 1000)
  // setInterval(()=>aria2.sendAria2cRequest('aria2.getVersion'), 3000);
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (aria2.aria2cProcess) {
      aria2.aria2cProcess.kill()
    }
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})


// IPC handlers
ipcDownloadHandler()
ipcGetdataHanlder()
ipcPopupHandler()
ipcActionsHandler()
