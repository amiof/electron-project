import { StoreApi } from "zustand"
import { TDownloaderStore } from "./storeType"
import { formatBytes, getFileName } from "@src/utils.ts"
import { TDownloads } from "@src/types.ts"

export type SetState = StoreApi<TDownloaderStore>["setState"];
export type GetState = StoreApi<TDownloaderStore>["getState"];

export const downloaderAction = (set: SetState, get: GetState) => ({
  getFiles: (file: string) => {
    const currentFiles = get().files
    if (currentFiles && !currentFiles.includes(file)) {
      set({ files: [...currentFiles, file] })
    }
  },
  getDownloads: async () => {
    try {
      const downloadsRecords = await window.electronAPI.getDownloads()
      set({ downloadsRow: [...downloadsRecords] })
    }
    catch (error) {
      console.error(error)
    }
    
  },
  getAllDownloadsRow: async () => {
    
    const tellActive = await window.electronAPI.tellActive()
    const tellStopped = await window.electronAPI.tellStopped()
    const tellWaiting = await window.electronAPI.tellWaiting()
    
    if (tellActive.length) {
      set({ tellActive: [...tellActive] })
    }
    else {
      set({ tellActive: [] })
    }
    const downloadsRows: TDownloads[] = [...tellStopped, ...tellWaiting, ...tellActive].map((download, index) => {
      return {
        Id: index + 1,
        FileName: getFileName(download.files[0].path),
        Url: download.files[0].uris[0].uri,
        SavePath: download.dir,
        Size: formatBytes(+download.totalLength),
        CreatedAt: new Date,
        Percentage: isNaN(+download.completedLength / +download.totalLength) ? 0 : Number(((+download.completedLength / +download.totalLength) * 100).toFixed(0)),
        Status: download.status,
        Gid: download.gid,
        NumberConnections: download.connections
      }
    })
    set({ allDownloadsRow: [...downloadsRows] })
    
    
  }
  // removeFile: (file: string) => {
  //   set((state) => ({ files: state.files.filter(f => f !== file) }));
  // },
  // clearFiles: () => {
  //   set({ files: [] });
  // },
})
