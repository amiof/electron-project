import { ChildProcess, spawn } from "node:child_process"
import { EventEmitter } from "node:events"
import WebSocket from "ws"
import { config } from "./aria2Config"
import { aria2BinPath } from "./utils"

interface Aria2cRequest {
  jsonrpc: "2.0"
  id: string
  method: string
  params: (string | any[])[]
}

export default class Aria2c extends EventEmitter {
  ws: WebSocket | null = null
  aria2cProcess: ChildProcess | null = null
  
  aria2cSecret = "test"
  aria2cPort = 6800
  
  requestMap = new Map<
    string,
    {
      resolve: (value: any) => void
      reject: (reason?: any) => void
    }
  >()
  
  private shuttingDown = false

  start() {
    if (this.aria2cProcess) {
      return
    }

    this.aria2cProcess = spawn(aria2BinPath(), [
      ...config,
      `--rpc-listen-port=${this.aria2cPort}`,
      `--rpc-secret=${this.aria2cSecret}`
    ])
    
    this.aria2cProcess.stdout?.on("data", (data: Buffer) => {
      console.log(`aria2c stdout: ${data}`)
    })
    
    this.aria2cProcess.stderr?.on("data", (data: Buffer) => {
      console.error(`aria2c stderr: ${data}`)
    })
    
    this.aria2cProcess.on("error", (error) => {
      console.error("Failed to start aria2c:", error)
    })
    
    this.aria2cProcess.on("exit", (code, signal) => {
      console.log("aria2c exited:", {
        code,
        signal
      })
    })
    
    this.aria2cProcess.on("close", (code, signal) => {
      console.log("aria2c closed:", {
        code,
        signal
      })
      
      this.ws?.close()
      this.ws = null
      this.aria2cProcess = null
      
      this.emit("processClose", {
        code,
        signal
      })
    })
  }

  connect() {
    if (this.ws) {
      return
    }
    
    this.ws = new WebSocket(`ws://localhost:${this.aria2cPort}/jsonrpc`)

    this.ws.onopen = () => {
      console.log("Connected to Aria2")
    }

    this.ws.onclose = () => {
      console.log("Connection closed to Aria2")
      this.ws = null
    }
    
    this.ws.onerror = (error) => {
      console.error("Aria2 WebSocket error:", error)
    }
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString())
        
        // RPC response
        if (data.id && this.requestMap.has(data.id)) {
          const request = this.requestMap.get(data.id)
          
          if (!request) {
            return
          }
          
          if (data.error) {
            request.reject(new Error(data.error.message))
          }
          else {
            request.resolve(data.result)
          }

          this.requestMap.delete(data.id)
          
          console.log("data Evnet ws ", data)
          
          return
        }
        
        // aria2 event
        if (data.method) {
          
          console.log("Aria2 Event:", data.method, data.params)
          const eventName = data.method.replace("aria2.", "")
          
          this.emit(eventName, data.params?.[0])
        }
      }
      catch (error) {
        console.error("Error parsing aria2 response:", error)
      }
    }
  }
  
  sendAria2cRequest(method: string, params: any[] = [], id: string = this.generateId()) {
    
    if (!this.isRunning()) {
      return
    }
    if (!this.isConnected()) {
      return Promise.reject(new Error("Aria2 WebSocket is not open"))
    }
    
    return new Promise((resolve, reject) => {
      this.requestMap.set(id, {
        resolve,
        reject
      })
      
      const requestData: Aria2cRequest = {
        jsonrpc: "2.0",
        id,
        method: `aria2.${method}`,
        params: [`token:${this.aria2cSecret}`, ...params]
      }
      
      this.ws!.send(JSON.stringify(requestData))
      
      setTimeout(() => {
        const request = this.requestMap.get(id)
        
        if (!request) {
          return
        }
        
        this.requestMap.delete(id)
        
        reject(new Error(`aria2 request timed out: ${method}`))
      }, 5000)
    })
  }
  
  isRunning() {
    return (
      this.aria2cProcess !== null &&
      this.aria2cProcess.exitCode === null
    )
  }
  
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
  
  async shutdown() {
    if (this.shuttingDown) return
    
    this.shuttingDown = true
    
    console.log("Shutting down aria2...")
    
    try {
      // Give WebSocket a chance to connect
      await this.waitForWebSocket(3000)
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        await this.sendAria2cRequest("shutdown")
        
        await this.waitForProcessExit(5000)
        
        console.log("aria2 shutdown successfully")
      }
      else {
        console.warn(
          "Aria2 RPC unavailable, killing process..."
        )
        
        this.aria2cProcess?.kill()
        
        await this.waitForProcessExit(3000)
      }
    }
    finally {
      this.ws?.close()
      this.ws = null
      
      this.aria2cProcess = null
      this.shuttingDown = false
    }
  }
  
  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  private waitForWebSocket(timeout: number) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }
    
    return new Promise<void>((resolve) => {
      const start = Date.now()
      
      const check = () => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          resolve()
          return
        }
        
        if (Date.now() - start >= timeout) {
          resolve()
          return
        }
        
        setTimeout(check, 50)
      }
      
      check()
    })
  }
  
  private waitForProcessExit(timeout: number) {
    if (!this.aria2cProcess) {
      return Promise.resolve()
    }
    
    if (this.aria2cProcess.exitCode !== null) {
      return Promise.resolve()
    }
    
    return new Promise<void>((resolve) => {
      const process = this.aria2cProcess
      
      const timer = setTimeout(() => {
        process?.removeListener("exit", onExit)
        
        resolve()
      }, timeout)
      
      const onExit = () => {
        clearTimeout(timer)
        resolve()
      }
      
      process?.once("exit", onExit)
    })
  }
}
