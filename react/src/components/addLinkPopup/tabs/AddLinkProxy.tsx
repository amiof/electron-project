import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { TProxyConfig } from "@src/store/storeType.ts"
import useAddLinkStore from "@components/addLinkPopup/store/addLinkStore.ts"


const AddLinkProxy = () => {
  
  const setProxyConfigItem = useAddLinkStore(state => state.setProxyConfigItem)
  const proxyConfig = useAddLinkStore(state => state.proxyConfig)
  const setProxyConfigObject = useAddLinkStore(state => state.setProxyConfigObject)
  
  const [formValues, setFormValues] = useState<TProxyConfig>({
    proxyStatus: false,
    proxyType: "http",
    port: "8080",
    ip: "127.0.0.1",
    proxyUserName: "",
    proxyPassword: ""
  })
  
  
  // get proxy config from backend and set or set that if available in store
  useEffect(() => {
    
    (async () => {
      if (!proxyConfig) {
        const defaultProxyConfig = await window.electronAPI.getProxyConfig() as TProxyConfig
        setFormValues(defaultProxyConfig)
        setProxyConfigObject(defaultProxyConfig)
      }
      else {
        setFormValues(proxyConfig)
      }
    })()
    
  }, [])
  
  
  const handleInputChange = (field: keyof TProxyConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    
    const value = field === "proxyStatus"
      ? event.target.checked
      : event.target.value
    
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
    setProxyConfigItem(field, value)
  }
  
  const handleProxyTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      proxyType: event.target.value as "http" | "https"
    }))
    
    setProxyConfigItem("proxyType", event.target.value)
  }
  
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center relative"}>
      <form>
        <FormControl className={"gap-6"}>
          
          <div className={"flex items-center"}>
            <label id={"proxy-label"} className="mr-2">Proxy</label>
            <Checkbox
              name="proxyStatus"
              checked={formValues.proxyStatus}
              onChange={handleInputChange("proxyStatus")}
            />
          </div>
          
          <div className={"flex gap-5"}>
            <TextField
              name="ip"
              value={formValues.ip || ""}
              onChange={handleInputChange("ip")}
              placeholder="example: 127.0.0.1"
              label="IP"
              disabled={!formValues.proxyStatus}
            />
            
            <TextField
              name="port"
              value={formValues.port || ""}
              onChange={handleInputChange("port")}
              label="Port"
              type="number"
              disabled={!formValues.proxyStatus}
              placeholder="example: 8085"
            />
          
          </div>
          
          <div className={"flex gap-5"}>
            <TextField
              name="proxyUsername"
              value={formValues.proxyUserName || ""}
              onChange={handleInputChange("proxyUserName")}
              label="Username"
              disabled={!formValues.proxyStatus}
              placeholder="example: admin"
            />
            
            <TextField
              name="proxyPassword"
              value={formValues.proxyPassword || ""}
              onChange={handleInputChange("proxyPassword")}
              label="Password"
              type="password" // recommended for passwords
              disabled={!formValues.proxyStatus}
              placeholder="example: 12345"
            />
          </div>
          
          <FormLabel id="radio-Group">Proxy Type</FormLabel>
          <RadioGroup
            name="proxyType"
            value={formValues.proxyType}
            onChange={handleProxyTypeChange}
            row
          >
            <FormControlLabel value="http" control={<Radio />} label="http" disabled={!formValues.proxyStatus} />
            <FormControlLabel value="https" control={<Radio />} label="https" disabled={!formValues.proxyStatus} />
          </RadioGroup>
        </FormControl>
      
      </form>
    </div>
  )
}

export default AddLinkProxy
