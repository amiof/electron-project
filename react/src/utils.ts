export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}


export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals))} ${sizes[i]}`
}

export const getFileName = (name: string) => {
  try {
    const splitedName = name.split("/")
    return splitedName[splitedName.length - 1]
  }
  catch (error) {
    console.log(error)
    return ""
  }
}
