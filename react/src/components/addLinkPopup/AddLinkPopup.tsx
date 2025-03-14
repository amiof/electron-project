import { Button, TextField } from "@mui/material"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import { useState } from "react"

const AddLinkPopup = () => {
  
  const closePopupWindow = window.electronAPI.closePopupWindow
  const addDownloadDir = window.electronAPI.addDownloadDir
  
  const [linkAddress, setLinkAddress] = useState<string>("")
  
  const downlaodHandler = () => {
    if (linkAddress) {
      addDownloadDir(linkAddress)
    }
  }
  return (
    <div className={"h-full w-full "}>
      <div className={"flex items-center justify-center w-full h-[80%]"}>
        <div className={"flex gap-5 p-10 w-full flex-col"}>
          <TextField color={"success"} size={"small"} variant={"outlined"} sx={{ width: "97%" }}
                     placeholder={"http://www.google.com"} label={"link address"}
                     onChange={(e) => setLinkAddress(e.target.value)} />
          
          <TextField color={"success"} size={"small"} variant={"outlined"} sx={{ width: "97%" }}
                     placeholder={"file.zip"} label={"change file name"} />
          <div className={"flex items-center justify-start w-full"}>
            <TextField color={"success"} size={"small"} variant={"outlined"} value={64} sx={{ width: "30%" }}
                       placeholder={"64"} label={"connections"} />
          
          </div>
        </div>
      </div>
      <div className={"flex items-center justify-between w-full px-5 h-[20%]"}>
        <Button variant={"contained"} color={"error"} endIcon={<CancelOutlinedIcon />} size={"small"}
                onClick={closePopupWindow}>close</Button>
        <div className={"flex gap-2 "}>
          <Button variant={"contained"} color={"success"} size={"small"}
                  endIcon={<DownloadOutlinedIcon />} onClick={downlaodHandler}>download</Button>
          <Button variant={"contained"} size={"small"} endIcon={<AddCircleOutlineOutlinedIcon />}>add</Button>
        </div>
      </div>
    </div>
  )
}

export default AddLinkPopup