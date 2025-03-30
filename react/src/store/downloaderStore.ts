import { create } from "zustand"
import { TDownloaderStore } from "./storeType"
import { downloaderAction } from "./downloaderAction"

const useDownloaderStore = create<TDownloaderStore>((set, get) => ({
  files: null,
  tellActive: [],
  tellStopped: [],
  tellWaiting: [],
  downloadsRow: [],
  allDownloadsRow: [],
  activeDownloads: [],
  downloadedFilesDetails: {},
  completedRowFromDB: [],
  selectedRows: [],
  searchValue: "",
  sidebarSelectedLabel: "",
  downloadsGroupByLabel: { "null": [] },
  ...downloaderAction(set, get)
}))

export default useDownloaderStore
