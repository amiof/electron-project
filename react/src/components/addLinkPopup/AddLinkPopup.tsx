import useAddLinkStore from "@components/addLinkPopup/store/addLinkStore.ts"
import AddLinkOptions from "@components/addLinkPopup/tabs/AddLinkOptions.tsx"
import AddLinkProxy from "@components/addLinkPopup/tabs/AddLinkProxy.tsx"
import AddLinkTab from "@components/addLinkPopup/tabs/AddLinkTab.tsx"
import { TAddLinkTabs } from "@components/addLinkPopup/types.ts"
import CustomTitlebar from "@components/customTilebar/CustomTitlebar"
import { AddLink, Settings, VpnLock } from "@mui/icons-material"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import { Button, Tab, Tabs } from "@mui/material"
import { getIdFromLocation } from "@src/utils.ts"
import { useState } from "react"
import { useLocation } from "react-router-dom"

const AddLinkPopup = () => {
  const closePopupWindow = window.electronAPI.closePopupWindow
  const addDownloadDir = window.electronAPI.addDownloadDir
  const addDownloadPopup = window.electronAPI.addDownloadPopup

  const location = useLocation()
  const id = getIdFromLocation(location, ":")

  const linkAddressStore = useAddLinkStore((state) => state.linkAddressStore)
  const savePathStore = useAddLinkStore((state) => state.savePathStore)
  const fileNameStore = useAddLinkStore((state) => state.fileNameStore)
  const proxyConfigs = useAddLinkStore((state) => state.proxyConfig)
  const options = useAddLinkStore((state) => state.options)

  const downloadHandler = async () => {
    if (linkAddressStore) {
      const gid = await addDownloadDir(linkAddressStore, savePathStore, fileNameStore, proxyConfigs, options)
      addDownloadPopup(gid, fileNameStore)
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
    <div className="flex flex-col w-full h-full">
      <CustomTitlebar id={id} />
      <div
        className={
          "h-full w-full flex flex-col bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(34,197,94,0.10),transparent_32%),linear-gradient(145deg,#05080d_0%,#0a1019_45%,#0d1420_100%)] rounded-lg "
        }
      >
        <div className={"w-full px-10"}>
          <Tabs orientation={"horizontal"} variant="scrollable" value={value} onChange={handleChange}>
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
            <Button
              variant={"outlined"}
              color={"success"}
              size={"small"}
              endIcon={<DownloadOutlinedIcon />}
              disabled={!linkAddressStore || !savePathStore}
              onClick={downloadHandler}
            >
              download
            </Button>
            <Button
              variant={"outlined"}
              size={"small"}
              disabled={!linkAddressStore || !savePathStore}
              endIcon={<AddCircleOutlineOutlinedIcon />}
            >
              add
            </Button>
          </div>
          <Button variant={"outlined"} color={"error"} size={"small"} onClick={() => closePopupWindow(id)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddLinkPopup
