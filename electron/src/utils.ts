import path from "path"
import os from "os"
import *  as fs from "fs/promises"
import * as fsnp from "fs"
import { TFileDetails } from "./types"
import { app } from "electron"

export const checkAndCreateFolder = async () => {
  
  try {
    
    let target: string[]
    const platform = process.platform
    let basePath: string
    
    switch (platform) {
      case "win32":
        basePath = process.env.UserProlfile || "C://windows/Download"
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "musics"),
          path.join(basePath, "AMDownloader", "videos"),
          path.join(basePath, "AMDownloader", "images"),
          path.join(basePath, "AMDownloader", "documents"),
          path.join(basePath, "AMDownloader", "other")
        ]
        break
      case "linux":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "musics"),
          path.join(basePath, "AMDownloader", "videos"),
          path.join(basePath, "AMDownloader", "images"),
          path.join(basePath, "AMDownloader", "documents"),
          path.join(basePath, "AMDownloader", "other")
        ]
        break
      case "darwin":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "musics"),
          path.join(basePath, "AMDownloader", "videos"),
          path.join(basePath, "AMDownloader", "images"),
          path.join(basePath, "AMDownloader", "documents"),
          path.join(basePath, "AMDownloader", "other")
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
        
        basePath = process.env.UserProlfile || "C://windows/Download"
        direction = path.join(basePath, "AMDownloader", folderName)
        
        break
      
      case "linux":
        
        basePath = os.homedir()
        direction = path.join(basePath, "AMDownloader", folderName)
        
        break
      
      case "darwin":
        
        basePath = os.homedir()
        direction = path.join(basePath, "AMDownloader", folderName)
        
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
        basePath = process.env.UserProlfile || "C://windows/Download"
        folders.map(folder => {
          const route = path.join(basePath, "AMDownloader", folder)
          target.push(route)
        })
        break
      case "linux":
        basePath = os.homedir()
        
        folders.map(folder => {
          const route = path.join(basePath, "AMDownloader", folder)
          target.push(route)
        })
        break
      case "darwin":
        basePath = os.homedir()
        folders.map(folder => {
          const route = path.join(basePath, "AMDownloader", folder)
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
  return path.join(app.getPath("userData"), "AMDownloader", "aria2.session")
}

export const checkSessionExists = () => {
  if (!fsnp.existsSync(getSessionPath())) {
    const fd = fsnp.openSync(getSessionPath(), "w")
    fsnp.closeSync(fd)
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