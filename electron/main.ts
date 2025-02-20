import {app, BrowserWindow, ipcMain, IpcMainEvent} from "electron";
import path from "path";
import aria2c from "./aria2c";

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true, // Crucial for security
            nodeIntegration: false // Disable node integration in renderer
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

// app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


const aria2 = new aria2c()

app.whenReady().then(() => {
    createWindow();
    // startAria2c();
    aria2.start()

    // setTimeout(connectToAria2c, 1000);
    setTimeout(() => aria2.connect(), 1000);
    // setInterval(()=>aria2.sendAria2cRequest('aria2.getVersion'), 3000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (aria2.aria2cProcess) {
            aria2.aria2cProcess.kill();
        }
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});


// IPC handlers
ipcMain.on('add-download', (event: IpcMainEvent, url: string) => {
    aria2.sendAria2cRequest('aria2.addUri', [[url]]);
});

ipcMain.on('add-download-dir', (event: IpcMainEvent, url: string, directory: string) => {
    console.log(url, directory)
    aria2.sendAria2cRequest('aria2.addUri', [[url], {
        dir: directory,
        'max-connection-per-server': 16, // Max connections per server
        split: 16, // Split into N connections
        'min-split-size': '1M', // Minimum split size
        continue: true // Enable resuming}]);
    }]);
})
ipcMain.on('tell-active', (event: IpcMainEvent) => {
    aria2.sendAria2cRequest('aria2.tellActive');
});

ipcMain.on('tell-stoped', (event: IpcMainEvent) => {
    aria2.sendAria2cRequest('aria2.tellStopped', [-1, 100]);
});

ipcMain.on('tell-waiting', (event: IpcMainEvent) => {
    aria2.sendAria2cRequest('aria2.tellWaiting', [-1, 100]);
});

// Handle other commands (pause, resume, remove, etc.) similarly


