import { create } from "zustand"
import { TDownloaderStore } from "./storeType"
import { downloaderAction } from "./downloaderAction"

const useDownloaderStore = create<TDownloaderStore>((set, get) => ({
  files: null,
  tellActive: [],
  downloadsRow: [],
  allDownloadsRow: [],
  ...downloaderAction(set, get)
}))

export default useDownloaderStore
