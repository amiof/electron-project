import { ChildProcess, spawn } from "child_process"
import WebSocket from "ws"
import { aria2BinPath } from "./utils"
import { config } from "./aria2Config"


interface Aria2cRequest {
  jsonrpc: "2.0";
  id: string;
  method: string;
  params: (string | any[])[]; // Allow for different parameter types
}

// interface Aria2cResponse {
//     jsonrpc: '2.0';
//     id: string;
//     result?: any;
//     error?: {
//         code: number;
//         message: string;
//     };
// }
//

export default class aria2c {
  ws: WebSocket | null = null
  aria2cProcess: ChildProcess | null = null
  aria2cSecret: string = "test" // STORE SECURELY! Use electron-store
  aria2cPort: number = 6800
  requestMap = new Map()
  
  start() {
    this.aria2cProcess = spawn(aria2BinPath(), [
      ...config,
      `--rpc-listen-port=${this.aria2cPort}`,
      `--rpc-secret=${this.aria2cSecret}`
    ])
    
    this.aria2cProcess.stdout!.on("data", (data: Buffer) => { // Use non-null assertion (!) if sure it's not null
      console.log(`aria2c stdout: ${data}`)
    })
    
    this.aria2cProcess.stderr!.on("data", (data: Buffer) => {
      console.error(`aria2c stderr: ${data}`)
    })
    
    this.aria2cProcess.on("close", (code: number) => {
      console.log(`aria2c exited with code ${code}`)
      this.ws = null
    })
  }
  
  // Handle connection open
  connect() {
    
    this.ws = new WebSocket("ws://localhost:6800/jsonrpc")
    this.ws.onopen = () => {
      console.log("Connected to Aria2")
      
      // Start sending requests only after the connection is open
    }
    
    // Handle connection close
    this.ws.onclose = () => {
      console.log("Connection closed to Aria2")
    }
    
    // Handle incoming messages
    this.ws.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data)
        if (data.id && this.requestMap.has(data.id)) {
          this.requestMap.get(data.id)(data.result)
          this.requestMap.delete(data.id)
          console.log("data", data)
        }
        else if (data.method) {
          console.log("Aria2 Event:", data.method, data.params)
        }
        // console.log("Message:", response)
      }
      catch (error) {
        console.error("Error parsing response:", error)
      }
    }
    
    // Handle errors
    this.ws.onerror = (error) => {
      console.error("An error occurred:", error)
    }
    
  }
  
  async sendAria2cRequest(method: string, params: any[] = [], id: string = this.generateId()) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        this.requestMap.set(id, resolve)
        const requestData: Aria2cRequest = {
          jsonrpc: "2.0",
          id: id,
          method: `aria2.${method}`,
          params: [`token:${this.aria2cSecret}`, ...params]
        }
        this.ws!.send(JSON.stringify(requestData))
        setTimeout(() => {
          if (this.requestMap.has(id)) {
            this.requestMap.delete(id)
            return reject(new Error("Request timed out"))
          }
        }, 5000)
        
      })
    }
    else {
      console.warn("WebSocket not open yet. Cannot send request.")
    }
  }
  
  generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  
}