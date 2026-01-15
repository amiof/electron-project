import { TProxyConfig } from "@src/store/storeType.ts"

export type TAddLinkStore = TAddLinkAction & TAddLink

export type TAddLinkAction = {
  setLinkAddressStore: (link: string) => void,
  setSavePathStore: (path: string) => void,
  setFileNameStore: (fineName: string) => void,
  setProxyConfigItem: (configItem: TKeyOfProxyConfig, config: TProxyConfig[TKeyOfProxyConfig]) => void,
  setProxyConfigObject: (config: TProxyConfig) => void
  setOptionsItem: (itemType: keyof TAddLinkOptions, value: string) => void
}

export type TAddLink = {
  linkAddressStore: string
  savePathStore: string,
  fileNameStore: string,
  proxyConfig: TProxyConfig | null,
  options: TAddLinkOptions | null
}

type TKeyOfProxyConfig = keyof TProxyConfig

export type TAddLinkOptions = {
  referrer?: string,
  header?: string,
  userAgent?: string,
  cookie?: string
}