import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    // In development, load the React dev server.
    mainWindow.loadURL("http://localhost:3000");
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html from extraResources.
    // Using process.resourcesPath ensures we reference the correct folder outside the asar.
    const indexPath = path.join(process.resourcesPath, "react", "dist", "index.html");

    console.log("Loading index.html from:", indexPath); // Add this line for debugging
    // mainWindow.loadFile(indexPath);
    mainWindow.loadFile(indexPath).catch((err) => console.error("Failed to load index.html:", err));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
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