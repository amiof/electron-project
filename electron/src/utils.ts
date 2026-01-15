import path from "path"
import os from "os"
import * as fs from "fs/promises"
import * as fsnp from "fs"
import { TFileDetails } from "./types"
import { app } from "electron"
import { exec } from "node:child_process"
import { electronStore } from "./store/electronStore"

const basePathSelected = electronStore.get("selectedStorageDirectory")

export const checkAndCreateFolder = async () => {
  
  try {
    
    
    let target: string[]
    const platform = process.platform
    let basePath: string
    switch (platform) {
      case "win32":
        basePath = basePathSelected ?? app.getPath("downloads")
        target = [
          path.join(basePath, "Shabdiz-DM", "compressed"),
          path.join(basePath, "Shabdiz-DM", "musics"),
          path.join(basePath, "Shabdiz-DM", "videos"),
          path.join(basePath, "Shabdiz-DM", "images"),
          path.join(basePath, "Shabdiz-DM", "documents"),
          path.join(basePath, "Shabdiz-DM", "other")
        ]
        break
      case "linux":
        basePath = basePathSelected ?? os.homedir()
        target = [
          path.join(basePath, "Shabdiz-DM", "compressed"),
          path.join(basePath, "Shabdiz-DM", "musics"),
          path.join(basePath, "Shabdiz-DM", "videos"),
          path.join(basePath, "Shabdiz-DM", "images"),
          path.join(basePath, "Shabdiz-DM", "documents"),
          path.join(basePath, "Shabdiz-DM", "other")
        ]
        break
      case "darwin":
        basePath = basePathSelected ?? os.homedir()
        target = [
          path.join(basePath, "Shabdiz-DM", "compressed"),
          path.join(basePath, "Shabdiz-DM", "musics"),
          path.join(basePath, "Shabdiz-DM", "videos"),
          path.join(basePath, "Shabdiz-DM", "images"),
          path.join(basePath, "Shabdiz-DM", "documents"),
          path.join(basePath, "Shabdiz-DM", "other")
        ]
        break
      default:
        throw new Error("your platform not  supported")
    }
    for (const targetPath of target) {
      try {
        
        await fs.access(targetPath)
        console.log("directory is available", targetPath)
      }
      catch (error) {
        
        await fs.mkdir(targetPath, { recursive: true })
        console.log("your  folder  created:", targetPath)
      }
    }
    
  }
  catch (error) {
    console.log("error  occured:", error)
  }
}

export const getFolderFromUrl = (url: string) => {
  
  const extension = url.split(".").pop()?.toLowerCase() || ""
  console.log("extention", extension)
  
  const fileTypes: Record<string, string[]> = {
    videos: ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"],
    musics: ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
    compressed: ["zip", "rar", "7z", "tar", "gz"],
    images: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"],
    documents: ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"]
  }
  
  let folderExtention: string | null = null
  
  for (const ext in fileTypes) {
    
    fileTypes[ext].map((format) => {
      
      if (format === extension) {
        folderExtention = ext
      }
      
    })
  }
  if (folderExtention) {
    
    return folderExtention
  }
  else {
    
    return "other"
  }
  
  
}


export const directionFolder = (url: string) => {
  
  try {
    
    const folderName = getFolderFromUrl(url)
    const platform = process.platform
    let direction: string = ""
    let basePath
    
    
    switch (platform) {
      case "win32":
        
        basePath = basePathSelected ?? app.getPath("downloads")
        direction = path.join(basePath, "Shabdiz-DM", folderName)
        
        break
      
      case "linux":
        
        basePath = basePathSelected ?? os.homedir()
        direction = path.join(basePath, "Shabdiz-DM", folderName)
        
        break
      
      case "darwin":
        
        basePath = basePathSelected ?? os.homedir()
        direction = path.join(basePath, "Shabdiz-DM", folderName)
        
        break
      
      
      default:
        throw new Error("your platform not supported")
    }
    
    if (direction) {
      return direction
      
    }
    else {
      return " "
    }
    
  }
  catch (error) {
    console.log("a error occurred:", error)
    return " "
  }
  
}


export const getFilesInDirectory = (directoryPath?: string): TFileDetails[] => {
  const routes = directoryPath ? [directoryPath] : savedPath()
  try {
    let filesDetails: TFileDetails[] = []
    routes.map(route => {
      
      const files = fsnp.readdirSync(route)
      const dir = files.map((file) => {
        const filePath = path.join(route, file)
        const stats = fsnp.statSync(filePath)
        
        return {
          name: file,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          isDirectory: stats.isDirectory()
        }
      })
      
      filesDetails.push(...dir)
    })
    return filesDetails
  }
  catch (error) {
    console.error("Error reading directory:", error)
    return []
  }
}


export const savedPath = () => {
  
  try {
    
    const target: string[] = []
    const platform = process.platform
    let basePath: string
    const folders = ["compressed", "musics", "videos", "images", "documents", "other"]
    switch (platform) {
      case "win32":
        basePath = basePathSelected ?? app.getPath("downloads")
        folders.map(folder => {
          const route = path.join(basePath, "Shabdiz-DM", folder)
          target.push(route)
        })
        break
      case "linux":
        basePath = basePathSelected ?? os.homedir()
        
        folders.map(folder => {
          const route = path.join(basePath, "Shabdiz-DM", folder)
          target.push(route)
        })
        break
      case "darwin":
        basePath = basePathSelected ?? os.homedir()
        folders.map(folder => {
          const route = path.join(basePath, "Shabdiz-DM", folder)
          target.push(route)
        })
        break
      default:
        throw new Error("your platform not  supported")
      
    }
    
    return target
  }
  catch (error) {
    console.error(error)
    return []
  }
}


export const getSessionPath = () => {
  return path.join(app.getPath("userData"), "Shabdiz-data", "aria2.session")
}

export const checkSessionExists = () => {
  
  const sessionPath = getSessionPath()
  const parentDir = path.dirname(sessionPath)
  
  if (!fsnp.existsSync(parentDir)) {
    fsnp.mkdirSync(parentDir, { recursive: true }) // This creates the full path
  }
  if (!fsnp.existsSync(sessionPath)) {
    const fd = fsnp.openSync(sessionPath, "w")
    fsnp.closeSync(fd)
    
    console.log("session file  created ✌ ")
  }
  else {
    console.log("session file is exist 😇")
  }
}


export const aria2BinPath = () => {
  const systemPlatform = os.platform()
  let aria2cBinaryPath: string
  let basePath
  if (process.env.NODE_ENV === "development") {
    basePath = path.join(__dirname, "..", "src", "release-aria2", "bin")  // for develop mode
  }
  else {
    basePath = path.join(process.resourcesPath, "electron", "dist", "bin") //for product mode
  }
  
  try {
    
    switch (systemPlatform) {
      case "win32":
        aria2cBinaryPath = path.join(basePath, "win", "aria2c.exe")
        break
      case "darwin":
        aria2cBinaryPath = path.join(basePath, "macOS", "aria2c")
        break
      case "linux":
        // must install aria2 by user
        aria2cBinaryPath = "aria2c"
        break
      default:
        throw new Error(`Unsupported platform: ${systemPlatform}`)
    }
    return aria2cBinaryPath
    
  }
  catch (error) {
    console.error(error)
    return "aria2c"
  }
}


export const openFileExplorer = (directoryPath: string) => {
  const platform = os.platform() // Get the current operating system
  
  let command
  switch (platform) {
    case "win32": // Windows
      command = `explorer "${directoryPath}"`
      break
    case "darwin": // macOS
      command = `open "${directoryPath}"`
      break
    case "linux": // Linux
      command = `xdg-open "${directoryPath}"`
      break
    default:
      console.error("Unsupported platform:", platform)
      return
  }
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file explorer: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`File explorer stderr: ${stderr}`)
      return
    }
    console.log(`File explorer opened successfully: ${stdout}`)
  })
}

// get name from header of a link
export const extractFilenameFromDisposition = (headerValue: string | null) => {
  if (!headerValue) return null
  
  // First, try the modern filename* (RFC 5987 encoded)
  // filename*=UTF-8''encoded%20name.ext  or  filename*=utf-8''encoded-name
  const encodedMatch = headerValue.match(/filename\*=(UTF-8''|[^']*'')[^;]*/i)
  if (encodedMatch) {
    const encoded = encodedMatch[0].split(/''/, 2)[1] // get part after ''
    try {
      return decodeURIComponent(encoded)
    }
    catch (e) {
      // fallback if decode fails
    }
  }
  
  // Then try regular filename="..." or filename=...
  const filenameMatch = headerValue.match(/filename="?([^";]+)"?/i)
  if (filenameMatch && filenameMatch[1]) {
    return filenameMatch[1].trim()
  }
  
  return null
}
