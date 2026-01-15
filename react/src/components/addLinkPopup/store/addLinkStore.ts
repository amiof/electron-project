import { create } from "zustand"
import { TAddLinkStore } from "@components/addLinkPopup/store/addLinkStoreType.ts"
import { addLinkAction } from "@components/addLinkPopup/store/addLinkAction.ts"


const useAddLinkStore = create<TAddLinkStore>((set, get) => ({
  //add link
  linkAddressStore: "",
  fileNameStore: "",
  savePathStore: "",
  // proxy
  proxyConfig: null,
  //options
  options: null,
  ...addLinkAction(set, get)
}))


export default useAddLinkStore