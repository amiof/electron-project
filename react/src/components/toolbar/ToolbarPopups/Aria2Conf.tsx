import { Button, FormControl, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { TAria2Config } from "@src/store/storeType.ts"

type Props = {
  id: string,
}

const Aria2Conf = (props: Props) => {
  
  const { id } = props
  
  const closePopupWindow = window.electronAPI.closePopupWindow
  
  const [formValue, setFormValue] = useState<TAria2Config>({
    minSplitSize: "8M",
    connectTimeout: "60",
    maxDownloadLimit: "0",
    maxConnectionSplit: "8",
    maxConnection: "8",
    dnsServer: "8.8.8.8"
  })
  
  useEffect(() => {
    (async () => {
      const defaultAria2Config = await window.electronAPI.getAria2Config() as TAria2Config
      setFormValue(defaultAria2Config)
    })()
  }, [])
  
  // The reusable onChange handler
  const handleInputChange = (field: keyof TAria2Config) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormValue(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }
  
  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.electronAPI.setAria2Config(formValue)
    window.electronAPI.showNotification({
      title: "Aria2 Settings Saved",
      body: "Your aria2 configuration has been saved successfully.\n for use config please restart program"
    })
  }
  
  return (
    <div className="flex justify-center items-center w-full h-full">
      <form onSubmit={submitHandler}>
        <FormControl className={"gap-6"}>
          <TextField
            name="dnsServer"
            value={formValue.dnsServer || ""}
            onChange={handleInputChange("dnsServer")}
            label="DNS Server"
            placeholder="example: 8.8.8.8"
          />
          
          <TextField
            name="maxConnection"
            value={formValue.maxConnection || ""}
            onChange={handleInputChange("maxConnection")}
            label="Max connection per server"
            placeholder="example: 8"
          />
          
          <TextField
            name="maxConnectionSplit"
            value={formValue.maxConnectionSplit || ""}
            onChange={handleInputChange("maxConnectionSplit")}
            label="Split"
            placeholder="example: 8"
          />
          
          <TextField
            name="minSplitSize"
            value={formValue.minSplitSize || ""}
            onChange={handleInputChange("minSplitSize")}
            label="Min split size"
            placeholder="example: 8M"
          />
          
          <TextField
            name="maxDownloadLimit"
            value={formValue.maxDownloadLimit || ""}
            onChange={handleInputChange("maxDownloadLimit")}
            label="Max download limit"
            placeholder="example: 100K"
          />
          
          <TextField
            name="connectTimeout"
            value={formValue.connectTimeout || ""}
            onChange={handleInputChange("connectTimeout")}
            label="Connect timeout (seconds)"
            placeholder="example: 60"
          />
        </FormControl>
        
        <div className={"w-full flex justify-end gap-2 absolute bottom-3 right-5"}>
          <Button variant="contained" color="primary" type="submit">Save</Button>
          <Button variant="outlined" onClick={() => closePopupWindow(id)}>Close</Button>
        </div>
      </form>
    </div>
  )
}

export default Aria2Conf
