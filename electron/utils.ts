import path from "path"
import os from "os"
import *  as fs from "fs/promises"

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
          path.join(basePath, "AMDownloader", "music"),
          path.join(basePath, "AMDownloader", "video"),
          path.join(basePath, "AMDownloader", "image"),
          path.join(basePath, "AMDownloader", "document")
        ]
        break;
      case "linux":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "music"),
          path.join(basePath, "AMDownloader", "video"),
          path.join(basePath, "AMDownloader", "image"),
          path.join(basePath, "AMDownloader", "document")

        ]
        break;
      case "darwin":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "music"),
          path.join(basePath, "AMDownloader", "video"),
          path.join(basePath, "AMDownloader", "image"),
          path.join(basePath, "AMDownloader", "document")
        ]
        break;
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
