import { StoreApi } from "zustand"
import { TDownloaderStore } from "./storeType"
import { formatBytes, getFileName } from "@src/utils.ts"
import { TDownloads, TFileDetails, TtellRes } from "@src/types.ts"

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
    await get().getTellStopped()
    await get().getTellActive()
    await get().getTellWaiting()
    const tellActive = get().tellActive
    const tellWaiting = get().tellWaiting
    const tellStopped = get().tellStopped
    const downloadedFilesDetails = get().downloadedFilesDetails
    
    const downloadsRows: TDownloads[] = [...tellStopped, ...tellWaiting, ...tellActive].map((download, index) => {
      const fileName = getFileName(download.files[0].path)
      const fileCreateAte = downloadedFilesDetails?.[fileName]?.createdAt ? downloadedFilesDetails[fileName].createdAt : new Date()
      return {
        Id: index + 1,
        FileName: fileName,
        Url: download.files[0].uris[0].uri,
        SavePath: download.dir,
        Size: formatBytes(+download.totalLength),
        CreatedAt: fileCreateAte,
        CompletedSize: formatBytes(+download.completedLength),
        Percentage: isNaN(+download.completedLength / +download.totalLength) ? 0 : Number(((+download.completedLength / +download.totalLength) * 100).toFixed(0)),
        Status: download.status,
        Gid: download.gid,
        NumberConnections: download.connections
      }
    })
    set({ allDownloadsRow: [...downloadsRows] })
    
  },
  getTellActive: async () => {
    const tellActive = await window.electronAPI.tellActive()
    if (tellActive?.length) {
      set({ tellActive: [...tellActive] })
    }
    else {
      set({ tellActive: [] })
    }
  },
  getTellStopped: async () => {
    const tellStopped = await window.electronAPI.tellStopped()
    if (tellStopped?.length) {
      set({ tellStopped: [...tellStopped] })
    }
    else {
      set({ tellStopped: [] })
    }
  },
  getTellWaiting: async () => {
    const tellWaiting = await window.electronAPI.tellWaiting()
    if (tellWaiting?.length) {
      set({ tellWaiting: [...tellWaiting] })
    }
    else {
      set({ tellWaiting: [] })
    }
  },
  
  // set active data in electron for update dataGrid download rows
  setActiveDataToElectron: async (data: TtellRes) => {
    await window.electronAPI.setActiveDownloadData(data)
  },
  
  getActiveDataFromElectron: async () => {
    const result = await window.electronAPI.getActiveDownloadData()
    set({ activeDownloads: [...result] })
  },
  getDownloadedFilesDetails: async () => {
    const filesDetails = await window.electronAPI.getDownloadedFilesDetails()
    //change array to object
    const filesObject: Record<string, TFileDetails> = filesDetails.reduce((acc, file) => {
      acc[file.name] = file
      return acc
    }, {} as Record<string, TFileDetails>)
    set({ downloadedFilesDetails: { ...filesObject } })
  }



// removeFile: (file: string) => {
//   set((state) => ({ files: state.files.filter(f => f !== file) }));
// },
// clearFiles: () => {
//   set({ files: [] });
// },
})
