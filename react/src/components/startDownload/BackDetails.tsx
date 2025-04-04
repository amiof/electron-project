import { TDetails } from "@components/startDownload/startDownload.tsx"
import { Chip } from "@mui/material"
import { TtellRes } from "@src/types.ts"
import styles from "./style.module.scss"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getIdFromLocation } from "@src/utils.ts"
import { useLocation } from "react-router-dom"
import StopIcon from "@mui/icons-material/Stop"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import FolderIcon from "@mui/icons-material/Folder"
import UndoIcon from "@mui/icons-material/Undo"
import { ReactElement } from "react"
import ActionButton from "@components/startDownload/ActionButton.tsx"
import useDownloaderStore from "@src/store/downloaderStore.ts"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>
}
type actionButton = {
  Icon: ReactElement
  title: string
  action?: () => void
}
const BackDetails = (props: Props) => {
  const { details, downloadStatus, setShowMore } = props
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const closePopup = window.electronAPI.closePopupWindow
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  
  const percentage = downloadStatus ? +(+downloadStatus?.completedLength / +downloadStatus?.totalLength * 100).toFixed(0) : 0
  
  const actionButtonData: actionButton[] = [
    {
      action: () => {
        window.electronAPI.stopDownloadByGid(gid)
      },
      Icon: <StopIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
      title: "Pause"
    },
    {
      action: () => {
        window.electronAPI.unPauseByGid(gid)
        getAllDownloads()
      },
      Icon: <PlayArrowIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
      title: "Resume"
    },
    {
      action: () => console.log("delete"),
      Icon: <DeleteIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
      title: "delete"
    },
    {
      action: () => closePopup(gid),
      Icon: <CancelIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
      title: "Close"
    },
    {
      action: () => window.electronAPI.openFolder(String(details[2].value)),
      Icon: <FolderIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
      title: "open"
    }
  ]
  
  const back: actionButton = {
    action: () => setShowMore(false),
    Icon: <UndoIcon sx={{ color: "darkgray", width: "32px", height: "32px" }} />,
    title: "back"
  }
  
  return (
    <>
      <div className={styles.backDetailsContainer}>
        <div className={"h-full w-[50%] flex flex-col justify-between items-center"}>
          <div className={"h-[68%] border border-neutral-800 rounded-4xl w-full flex flex-wrap gap-x-5 px-3"}>
            
            <div className={"pt-1 justify-center flex  items-center gap-x-5 w-full"}>
              <Chip label={`${details[0].label}  ${details[0].value}`} variant={"outlined"} color={"success"}
                    sx={{ minWidth: "120px" }} />
              <Chip label={`${details[4].label}  ${details[4].value}`} variant={"outlined"} color={"success"} />
            </div>
            
            <div className={"justify-center flex  items-center gap-x-5 w-full"}>
              <Chip label={`${details[6].label}  ${details[6].value}`} variant={"outlined"} color={"default"} />
              <Chip label={`${details[5].label}  ${details[5].value}`} variant={"outlined"} color={"default"} />
            </div>
            
            <div className={"justify-center flex  items-center gap-x-5 w-full"}>
              <Chip label={`${details[3].label}  ${details[3].value}`} variant={"outlined"} color={"secondary"} />
              <Chip label={`${details[7].label}  ${details[7].value}`} variant={"outlined"} color={"secondary"} />
            </div>
            
            <div className={"justify-center flex  items-center w-full "}>
              <Chip label={`${details[2].label}  ${details[2].value}`} variant={"outlined"} color={"warning"} />
            </div>
            
          </div>
          
          <div
            className={"flex gap-x-5 flex-wrap w-full h-[30%] border border-neutral-800 rounded-4xl  items-center justify-center"}>
            {
              actionButtonData.map((item, index) => (
                <ActionButton index={index} action={item.action} Icon={item.Icon} title={item.title} />
              ))
            }
          </div>
        </div>
        
        <div className={"w-[50%] h-full flex justify-center border border-neutral-800 rounded-4xl"}>
          <div className={"h-full w-[50%] flex flex-col items-center justify-evenly"}>
            <div className={"absolute top-5 right-5"}>
              <ActionButton index={1} action={back.action} Icon={back.Icon} title={back.title} />
            </div>
            
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              strokeWidth={8}
              styles={{
                root: {},
                path: {
                  stroke: `#10F61A`,
                  stopColor: "red",
                  strokeOpacity: "60%",
                  strokeLinecap: "round",
                  transition: "stroke-dashoffset 0.5s ease 0s",
                  transform: "rotate(0turn)",
                  transformOrigin: "center center"
                },
                trail: {
                  stroke: "#d6d6d6",
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: "butt",
                  transform: "rotate(0.25turn)",
                  transformOrigin: "center center"
                },
                text: {
                  fill: "#ffffff",
                  fontSize: "12px"
                },
                background: {
                  fill: "#3e98c7"
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default BackDetails
