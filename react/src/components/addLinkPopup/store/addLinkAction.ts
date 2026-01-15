import { TAddLinkAction, TAddLinkOptions, TAddLinkStore } from "@components/addLinkPopup/store/addLinkStoreType.ts"
import { StoreApi } from "zustand"

export type SetState = StoreApi<TAddLinkStore>["setState"];
export type GetState = StoreApi<TAddLinkStore>["getState"];

export const addLinkAction = (set: SetState, get: GetState): TAddLinkAction => ({
  
  setLinkAddressStore: (link) => {
    set({ linkAddressStore: link })
  },
  setSavePathStore: (path) => {
    
    set({ savePathStore: path })
  },
  setFileNameStore: (fineName) => {
    
    set({ fileNameStore: fineName })
  },
  setProxyConfigItem: (configItem, config) => {
    const proxyConfigStore = get().proxyConfig
    if (proxyConfigStore) {
      
      proxyConfigStore[configItem] = config as never
      set({ proxyConfig: proxyConfigStore })
    }
  },
  
  setProxyConfigObject: (configObject) => {
    set({ proxyConfig: configObject })
  },
  
  setOptionsItem: (itemType, value) => {
    const options = get().options
    if (options) {
      options[itemType] = value
      if (!value) {
        delete options[itemType]
      }
      set({ options: { ...options } })
    }
    else {
      set({ options: { [itemType]: value } as TAddLinkOptions })
    }
    
  }
  
})