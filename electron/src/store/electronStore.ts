import Store from "electron-store"
import { TAria2Config, TProxyConfig } from "../types"

interface Schema {
  theme: string
  enableSpeedLimit: boolean
  setDns: boolean
  proxyConfig: TProxyConfig
  aria2Config: TAria2Config
  selectedStorageDirectory: string | null
}

//add electron-store for save settings to config.json
export const electronStore = new Store<Schema>({
  name: "shabdiz-config",
  defaults: {
    theme: "black",
    enableSpeedLimit: false,
    setDns: false,
    aria2Config: {
      minSplitSize: "8M",
      connectTimeout: "60",
      maxDownloadLimit: "0",
      maxConnectionSplit: "8",
      maxConnection: "8",
      dnsServer: "8.8.8.8"
    },
    proxyConfig: {
      proxyStatus: false,
      ip: "",
      port: "",
      proxyType: "http",
      proxyUserName: "",
      proxyPassword: ""
    },
    selectedStorageDirectory: null
    
  }
})