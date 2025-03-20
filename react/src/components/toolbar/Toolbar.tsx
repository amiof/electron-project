import styles from "./style.module.scss"
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined"
import StopOutlinedIcon from "@mui/icons-material/StopOutlined"
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined"
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined"
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined"
import ButtonAction from "@components/buttonAction/ButtonAction.tsx"
import { ReactElement } from "react"
import { Divider, IconButton, InputAdornment, TextField } from "@mui/material"
import AddLinkOutlinedIcon from "@mui/icons-material/AddLinkOutlined"
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { generateId } from "@src/utils.ts"

type TButtonActions = {
  IconElement: ReactElement
  title: string
}

const Toolbar = () => {
  
  
  const firstButtonActions: TButtonActions[] = [
    {
      IconElement: <PlayArrowOutlinedIcon fontSize={"medium"} />,
      title: "Resume"
    },
    {
      IconElement: <StopOutlinedIcon fontSize={"medium"} />,
      title: "Stop"
    },
    {
      IconElement: <DangerousOutlinedIcon fontSize={"medium"} />,
      title: "Stop All"
    }
  ]
  const secondButtonActions: TButtonActions[] = [
    {
      IconElement: <DeleteOutlineOutlinedIcon fontSize={"medium"} />,
      title: "Delete"
    },
    {
      IconElement: <SettingsOutlinedIcon fontSize={"medium"} />,
      title: "Options"
    },
    {
      IconElement: <ContentCopyOutlinedIcon fontSize={"medium"} />,
      title: "Queues"
    },
    
    {
      IconElement: <PendingActionsOutlinedIcon fontSize={"medium"} />,
      title: "Scheduler"
    },
    {
      IconElement: <ReplyOutlinedIcon sx={{ transform: "ScaleX(-1)" }} fontSize={"medium"} />,
      title: "Share"
    }
  ]
  
  const addDownloadDir = window.electronAPI.addDownloadDir
  const addLinkPopup = window.electronAPI.addLinkPopup
  const getAllDownloadRow = useDownloaderStore(state => state.getAllDownloadsRow)
  
  const clickHandler = async () => {
    
    const result = await addDownloadDir("https://www.pixelstalk.net/wp-content/uploads/2016/08/Best-Free-Desktop-Wallpaper-HD.jpg")
    if (result) {
      getAllDownloadRow()
    }
    console.log(result)
  }
  const createPopup = () => {
    const id = generateId()
    addLinkPopup(id)
  }
  
  
  return (
    <div className={styles.container}>
      <div className={"px-5"}>
        
        <TextField size={"small"} placeholder={"Add Url"}
                   sx={{
                     backgroundColor: "rgba(255, 255, 255, 0.08)",
                     borderRadius: "15px",
                     color: "white",
                     width: "180px",
                     "& .MuiOutlinedInput-root": {
                       borderRadius: "15px",
                       "&.Mui-focused fieldset": {
                         border: "0.5px solid green",
                         borderRadius: "15px",
                         outline: "none"
                       },
                       "&:hover fieldset": {
                         borderColor: "green",
                         borderRadius: "15px",
                         outline: "none"
                       }
                     }
                   }}
                   slotProps={
                     {
                       input: {
                         style: { color: "white" }, // Change text color to green
                         startAdornment: (
                           <InputAdornment position="start">
                             <IconButton onClick={clickHandler}>
                               <AddLinkOutlinedIcon style={{
                                 color: "white",
                                 rotate: "300deg",
                                 transform: "scaleX(-1)"
                               }} />
                             </IconButton>
                           </InputAdornment>
                         ),
                         endAdornment: (
                           <InputAdornment position={"end"}>
                             <IconButton onClick={createPopup}>
                               <CloudDownloadOutlinedIcon sx={{ color: "white" }} />
                             </IconButton>
                           </InputAdornment>
                         
                         )
                       }
                       
                     }
                   }
        />
      
      </div>
      
      <Divider orientation={"vertical"} variant={"middle"} flexItem className={"bg-neutral-700"} />
      
      <div className={styles.secondLineAction}>
        {
          firstButtonActions.map(item =>
            <ButtonAction iconElement={item.IconElement} title={item.title} />
          )
        }
      </div>
      
      <Divider orientation={"vertical"} variant={"middle"} flexItem className={"bg-neutral-700"} />
      
      <div className={styles.secondLineAction}>
        {
          secondButtonActions.map(item =>
            <ButtonAction iconElement={item.IconElement} title={item.title} />
          )
        }
      </div>
    </div>
  )
}

export default Toolbar
