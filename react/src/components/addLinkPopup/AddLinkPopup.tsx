import { Button, TextField } from "@mui/material"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import { useEffect, useState } from "react"
import { formatBytes, getFileName } from "@src/utils.ts"

const AddLinkPopup = () => {
  
  const closePopupWindow = window.electronAPI.closePopupWindow
  const addDownloadDir = window.electronAPI.addDownloadDir
  
  const [linkAddress, setLinkAddress] = useState<string>("")
  const [fileSize, setFileSize] = useState<string>("0")
  const [fileName, setFileName] = useState<string>("")
  
  const downlaodHandler = () => {
    if (linkAddress) {
      addDownloadDir(linkAddress)
      closePopupWindow()
    }
  }
  
  useEffect(() => {
    if (linkAddress) {
      const fileName = getFileName(linkAddress)
      setFileName(fileName)
      
      const getSize = async () => {
        try {
          const response = await fetch(linkAddress, { method: "HEAD" })
          const contentLength = response.headers.get("Content-Length")
          
          if (contentLength) {
            const formatSize = formatBytes(+contentLength)
            setFileSize(formatSize)
          }
          console.log(`File Size: ${contentLength} bytes`)
        }
        catch (error) {
          
          const response = await fetch(linkAddress, {
            method: "GET",
            headers: { Range: "bytes=0-0" } // get first byte
          })
          
          const contentLength2 = response.headers.get("Content-Range")?.split("/")[1]
          
          if (contentLength2) {
            const formatSize = formatBytes(+contentLength2)
            setFileSize(formatSize)
          }
          console.log(response.headers)
          console.error("Error fetching file info:", error)
        }
      }
      getSize()
      
    }
    else {
      setFileSize("0")
    }
  }, [linkAddress])
  
  return (
    <div className={"h-full w-full "}>
      <div className={"flex items-center justify-center w-full h-[80%]"}>
        <div className={"flex gap-5 p-10 w-full flex-col"}>
          <TextField color={"success"} size={"small"} variant={"outlined"} sx={{ width: "97%" }}
                     placeholder={"http://www.example.com"} label={"link address"}
                     onChange={(e) => setLinkAddress(e.target.value)} />
          
          <TextField color={"success"} size={"small"} variant={"outlined"} value={fileName} sx={{ width: "97%" }}
                     placeholder={"file.zip"} label={"change file name"} />
          <div className={"flex w-full  justify-between items-center"}>
            <TextField color={"success"} size={"small"} variant={"outlined"} value={64} sx={{ width: "30%" }}
                       placeholder={"64"} label={"connections"} />
            
            {
              +fileSize !== 0 && <span className={"px-5"}>{fileSize}</span>
            }
          </div>
        </div>
      </div>
      <div className={"flex items-center justify-between w-full px-5 h-[20%]"}>
        <Button variant={"outlined"} color={"error"} endIcon={<CancelOutlinedIcon />} size={"small"}
                onClick={closePopupWindow}>close</Button>
        <div className={"flex gap-2 "}>
          <Button variant={"outlined"} color={"success"} size={"small"}
                  endIcon={<DownloadOutlinedIcon />} onClick={downlaodHandler}>download</Button>
          <Button variant={"outlined"} size={"small"} endIcon={<AddCircleOutlineOutlinedIcon />}>add</Button>
        </div>
      </div>
    </div>
  )
}

export default AddLinkPopup