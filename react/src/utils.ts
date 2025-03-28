import { Location } from "react-router-dom"
import { TDownloads } from "@src/types.ts"

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

export const getIdFromLocation = (location: Location<unknown>, split: string) => {
  const splitedLocation = location.pathname.split(split)
  return splitedLocation[splitedLocation.length - 1]
}

export const formatTime = (seconds: number) => {
  if (seconds === Infinity) return "∞"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  return `${hours}h ${minutes}m ${secs}s`
}

export const searchInDownloadsRows = (data: TDownloads[], searchValue: string) => {
  
  if (searchValue === "") return data
  return data.filter(item => item.FileName.toLowerCase().includes(searchValue.toLowerCase()))
  
}