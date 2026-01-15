import { Button, Tab, Tabs } from "@mui/material"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import { useState } from "react"
import { getIdFromLocation } from "@src/utils.ts"
import { useLocation } from "react-router-dom"
import { AddLink, Settings, VpnLock } from "@mui/icons-material"
import { TAddLinkTabs } from "@components/addLinkPopup/types.ts"
import AddLinkTab from "@components/addLinkPopup/tabs/AddLinkTab.tsx"
import AddLinkProxy from "@components/addLinkPopup/tabs/AddLinkProxy.tsx"
import AddLinkOptions from "@components/addLinkPopup/tabs/AddLinkOptions.tsx"
import useAddLinkStore from "@components/addLinkPopup/store/addLinkStore.ts"

const AddLinkPopup = () => {
  
  const closePopupWindow = window.electronAPI.closePopupWindow
  const addDownloadDir = window.electronAPI.addDownloadDir
  const addDownloadPopup = window.electronAPI.addDownloadPopup
  
  const location = useLocation()
  const id = getIdFromLocation(location, ":")
  
  const linkAddressStore = useAddLinkStore(state => state.linkAddressStore)
  const savePathStore = useAddLinkStore(state => state.savePathStore)
  const fileNameStore = useAddLinkStore(state => state.fileNameStore)
  const proxyConfigs = useAddLinkStore(state => state.proxyConfig)
  const options = useAddLinkStore(state => state.options)
  
  
  const downloadHandler = async () => {
    if (linkAddressStore) {
      const gid = await addDownloadDir(linkAddressStore, savePathStore, fileNameStore, proxyConfigs, options)
      addDownloadPopup(gid)
      closePopupWindow(id)
    }
  }
  
  const [value, setValue] = useState<TAddLinkTabs>("Link")
  
  const handleChange = (_event: React.SyntheticEvent, newValue: TAddLinkTabs) => {
    setValue(newValue)
  }
  
  const changeComponents = () => {
    switch (value) {
      case "Link":
        return <AddLinkTab />
      case "Proxy":
        return <AddLinkProxy />
      case "Options":
        return <AddLinkOptions />
      default:
        return <AddLinkTab />
    }
  }
  
  
  return (
    
    <div className={"h-full w-full flex flex-col "}>
      <div className={"w-full px-10"}>
        
        <Tabs orientation={"horizontal"} variant="scrollable"
              value={value}
              onChange={handleChange}
        >
          <Tab label={"Link"} value={"Link"} iconPosition={"start"} icon={<AddLink sx={{ rotate: "120deg" }} />} />
          <Tab label={"Proxy"} value={"Proxy"} iconPosition={"start"} icon={<VpnLock />} />
          <Tab label={"Options"} value={"Options"} iconPosition={"start"} icon={<Settings />} />
        </Tabs>
      </div>
      <div className={"flex items-center justify-center h-full border border-neutral-700 m-5 rounded-2xl"}>
        {changeComponents()}
      </div>
      <div className={"flex items-center justify-between w-full px-10 h-[20%]"}>
        <div className={"flex gap-2 "}>
          <Button variant={"outlined"} color={"success"} size={"small"}
                  endIcon={<DownloadOutlinedIcon />}
                  disabled={!linkAddressStore || !savePathStore}
                  onClick={downloadHandler}>download</Button>
          <Button variant={"outlined"} size={"small"}
                  disabled={!linkAddressStore || !savePathStore}
                  endIcon={<AddCircleOutlineOutlinedIcon />}>add</Button>
        </div>
        <Button variant={"outlined"} color={"error"} size={"small"}
                onClick={() => closePopupWindow(id)}>Cancel</Button>
      </div>
    </div>
  
  )
}

export default AddLinkPopup