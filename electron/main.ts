import { app, BrowserWindow } from "electron";
import path from "path";
require('dotenv').config()


let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  console.log("NODE_ENV:", process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    // Load from localhost:3000 in development mode
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // Open DevTools for debugging
  } else {
    // Load from the built HTML file in production mode
    const indexPath = path.join(__dirname, '..', 'react', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
