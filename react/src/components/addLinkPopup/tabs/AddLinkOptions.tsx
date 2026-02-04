import { TextField } from "@mui/material"
import { useEffect, useState } from "react"
import useAddLinkStore from "@components/addLinkPopup/store/addLinkStore.ts"
import { TAddLinkOptions } from "@components/addLinkPopup/store/addLinkStoreType.ts"


const AddLinkOptions = () => {
  
  const setOptionItem = useAddLinkStore(state => state.setOptionsItem)
  const optionsStore = useAddLinkStore(state => state.options)
  
  const [formValues, setFormValues] = useState<TAddLinkOptions | null>(null)
  
  useEffect(() => {
    if (!formValues) {
      setFormValues(optionsStore)
    }
  }, [])
  
  const handleChange = (field: keyof TAddLinkOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }))
    
    setOptionItem(field, value)
  }
  
  return (
    <div className={"w-full h-full px-20 "}>
      <div className={"w-full h-full gap-6 flex flex-col items-center justify-center  "}>
        
        <TextField
          size={"small"}
          name="referre"
          fullWidth={true}
          value={formValues?.referrer || ""}
          onChange={handleChange("referrer")}
          label="referre"
        />
        
        <TextField
          size={"small"}
          name="header"
          fullWidth={true}
          onChange={handleChange("header")}
          value={formValues?.header || ""}
          label="header"
        />
        
        
        <TextField
          size={"small"}
          name="user-agent"
          fullWidth={true}
          onChange={handleChange("userAgent")}
          value={formValues?.userAgent || ""}
          label="user-agent"
        />
        
        <TextField
          size={"small"}
          name="cookie"
          fullWidth={true}
          onChange={handleChange("cookie")}
          value={formValues?.cookie || ""}
          label="cookie"
        />
      </div>
    
    
    </div>
  )
}

export default AddLinkOptions