import path from "path"
import os from "os"
import *  as fs from "fs/promises"
import { throws } from "assert"

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
          path.join(basePath, "AMDownloader", "document"),
          path.join(basePath, "AMDownloader", "other")
        ]
        break;
      case "linux":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "music"),
          path.join(basePath, "AMDownloader", "video"),
          path.join(basePath, "AMDownloader", "image"),
          path.join(basePath, "AMDownloader", "document"),
          path.join(basePath, "AMDownloader", "other")
        ]
        break;
      case "darwin":
        basePath = os.homedir()
        target = [
          path.join(basePath, "AMDownloader", "compressed"),
          path.join(basePath, "AMDownloader", "music"),
          path.join(basePath, "AMDownloader", "video"),
          path.join(basePath, "AMDownloader", "image"),
          path.join(basePath, "AMDownloader", "document"),
          path.join(basePath, "AMDownloader", "other")
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

export const getFolderFromUrl = (url: string) => {

  const extension = url.split(".").pop()?.toLowerCase() || ""
  console.log("extention", extension)

  const fileTypes: Record<string, string[]> = {
    video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    music: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'],
    compressed: ['zip', 'rar', '7z', 'tar', 'gz'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
    document: ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'],
  };

  let folderExtention: string | null = null

  for (const ext in fileTypes) {

    fileTypes[ext].map((format) => {

      if (format === extension) {
        folderExtention = ext
      }

    })
  }
  if (folderExtention) {
    console.log(folderExtention)
    return folderExtention
  } else {
    console.log("other")
    return "other"
  }


}


export const directionfolder = (url: string) => {

  try {

    const folderName = getFolderFromUrl(url)
    const platform = process.platform
    let direction: string = ""
    let basePath


    switch (platform) {
      case "win32":

        basePath = process.env.UserProlfile || "C://windows/Download"
        direction = path.join(basePath, "AMDownloader", folderName)

        break;

      case "linux":

        basePath = os.homedir()
        direction = path.join(basePath, "AMDownloader", folderName)

        break;

      case "darwin":

        basePath = os.homedir()
        direction = path.join(basePath, "AMDownloader", folderName)

        break;


      default:
        throw new Error("your platform not supported")
    }

    if(direction){
      return direction

    }else{
      return " "
    }

  }
  catch (error) {
    console.log("a error occurred:", error)
    return " "
  }

}


