import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { PlayForWork, SdCard, VpnLock } from "@mui/icons-material"
import { TOptionsTabs } from "@components/toolbar/types.ts"
import ProxyConfig from "@components/toolbar/ToolbarPopups/ProxyConfig.tsx"
import Aria2Conf from "@components/toolbar/ToolbarPopups/Aria2Conf.tsx"
import StorageConf from "@components/toolbar/ToolbarPopups/StorageConf.tsx"
import { useLocation } from "react-router-dom"
import { getIdFromLocation } from "@src/utils.ts"


const OptionsPopup = () => {
  const [value, setValue] = useState<TOptionsTabs>("proxy")
  
  const location = useLocation()
  const id = getIdFromLocation(location, ":")
  
  
  const handleChange = (_event: React.SyntheticEvent, newValue: TOptionsTabs) => {
    setValue(newValue)
  }
  const changeComponents = () => {
    switch (value) {
      case "proxy":
        return <ProxyConfig id={id} />
      case "aria2":
        return <Aria2Conf id={id} />
      case "storage":
        return <StorageConf id={id} />
      default:
        return <ProxyConfig id={id} />
    }
  }
  
  return (
    <div className={"w-full h-full flex"}>
      <div className={"w-1/4 h-full border-r border-r-stone-700"}>
        <Tabs orientation={"vertical"}
              variant="scrollable"
              value={value}
              onChange={handleChange}
        >
          <Tab label={"proxy"} value={"proxy"} iconPosition={"start"} icon={<VpnLock />} />
          <Tab label={"aria2"} value={"aria2"} iconPosition={"start"} icon={<PlayForWork />} />
          <Tab label={"storage"} value={"storage"} iconPosition={"start"} icon={<SdCard />} />
        </Tabs>
      
      </div>
      
      <div className={"w-full"}>
        {changeComponents()}
      </div>
    
    </div>
  )
}

export default OptionsPopup