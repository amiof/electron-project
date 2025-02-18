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

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});


// interface Aria2cRequest {
//   jsonrpc: '2.0';
//   id: string;
//   method: string;
//   params: (string | any[])[]; // Allow for different parameter types
// }
//
// interface Aria2cResponse {
//   jsonrpc: '2.0';
//   id: string;
//   result?: any;
//   error?: {
//     code: number;
//     message: string;
//   };
// }
//
// let aria2cProcess: ChildProcess | null = null;
// let ws: WebSocket | null = null;
// const aria2cSecret: string = 'test'; // STORE SECURELY! Use electron-store
// const aria2cPort: number = 6800;
//
// function startAria2c(): void {
//   aria2cProcess = spawn('aria2c', [
//     '--enable-rpc',
//     '--rpc-listen-all=true',
//     '--rpc-allow-origin-all',
//     `--rpc-listen-port=${aria2cPort}`,
//     `--rpc-secret=${aria2cSecret}`,
//   ]);
//
//   aria2cProcess.stdout!.on('data', (data: Buffer) => { // Use non-null assertion (!) if sure it's not null
//     console.log(`aria2c stdout: ${data}`);
//   });
//
//   aria2cProcess.stderr!.on('data', (data: Buffer) => {
//     console.error(`aria2c stderr: ${data}`);
//   });
//
//   aria2cProcess.on('close', (code: number) => {
//     console.log(`aria2c exited with code ${code}`);
//     ws = null;
//     // Handle aria2c exit appropriately
//   });
// }
//
// function connectToAria2c(): void {
//   ws = new WebSocket(`ws://localhost:${aria2cPort}/jsonrpc`);
//
//   ws.on('open', () => {
//     console.log('Connected to aria2c via WebSocket');
//     sendAria2cRequest('aria2.getVersion');
//   });
//
//   ws.on('message', (data: WebSocket.Data) => { // Data can be a string, Buffer, ArrayBuffer, or Buffer[]
//     console.log('Received from aria2c:', data.toString());
//     try {
//       const response: Aria2cResponse = JSON.parse(data.toString());
//       if (mainWindow) {  //Check if windows is exist
//         mainWindow.webContents.send('aria2c-response', response);
//       }
//     } catch (error) {
//       console.error('Error parsing aria2c response:', error);
//     }
//   });
//
//   ws.on('close', () => {
//     console.log('Disconnected from aria2c');
//     ws = null;
//   });
//
//   ws.on('error', (error: Error) => {
//     console.error('WebSocket error:', error);
//   });
// }
//
// function sendAria2cRequest(method: string, params: any[] = []): void {
//   if (!ws || ws.readyState !== WebSocket.OPEN) {
//     console.error('WebSocket is not open. Cannot send request.');
//     return;
//   }
//
//   const request: Aria2cRequest = {
//     jsonrpc: '2.0',
//     id: generateId(),
//     method: method,
//     params: [`token:${aria2cSecret}`, ...params],
//   };
//
//   ws.send(JSON.stringify(request));
// }
//
// function generateId(): string {
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }
//
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

// IPC handlers
ipcMain.on('add-download', (event: IpcMainEvent, url: string) => {
  aria2.sendAria2cRequest('aria2.addUri', [[url]]);
});

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


