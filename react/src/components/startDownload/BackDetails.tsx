import { TDetails } from "@components/startDownload/startDownload.tsx"
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from "@mui/material"
import { TtellRes } from "@src/types.ts"
import styles from "./style.module.scss"
import { getIdFromLocation } from "@src/utils.ts"
import { useLocation } from "react-router-dom"
import StopIcon from "@mui/icons-material/Stop"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import DeleteIcon from "@mui/icons-material/Delete"
import CancelIcon from "@mui/icons-material/Cancel"
import FolderIcon from "@mui/icons-material/Folder"
import { ReactElement, useState } from "react"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import MagnetIcon from "@src/assets/MagnetIcon.tsx"
import ChunkMap from "@components/startDownload/ChunkMap.tsx"
import { ProgressBar } from "react-progressbar-fancy"
import SpeedGraph from "@components/startDownload/SpeedGraph.tsx"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
  isMetaData: boolean
  isTorrent: boolean
}
type actionButton = {
  Icon: ReactElement
  title: string
  action?: () => void
}
const BackDetails = (props: Props) => {
  const { details, downloadStatus, isTorrent, isMetaData } = props

  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const closePopup = window.electronAPI.closePopupWindow
  const getAllDownloads = useDownloaderStore((state) => state.getAllDownloadsRow)

  const [open, setOpen] = useState(false)
  
  const percentage = !isMetaData
    ? downloadStatus
      ? +((+downloadStatus?.completedLength / +downloadStatus?.totalLength) * 100).toFixed(0)
      : 0
    : 0

  const actionButtonData: actionButton[] = [
    {
      action: () => {
        window.electronAPI.stopDownloadByGid(gid)
      },
      Icon: <StopIcon sx={{ color: "darkgray", width: "24px", height: "32px" }} />,
      title: "Pause"
    },
    {
      action: () => {
        window.electronAPI.unPauseByGid(gid)
        getAllDownloads()
      },
      Icon: <PlayArrowIcon sx={{ color: "darkgray", width: "24px", height: "32px" }} />,
      title: "Resume"
    },
    {
      action: () => console.log("delete"),
      Icon: <DeleteIcon sx={{ color: "darkgray", width: "24px", height: "32px" }} />,
      title: "delete"
    },
    {
      action: () => closePopup(gid),
      Icon: <CancelIcon sx={{ color: "darkgray", width: "24px", height: "32px" }} />,
      title: "Close"
    },
    {
      action: () => window.electronAPI.openFolder(String(details[2].value)),
      Icon: <FolderIcon sx={{ color: "darkgray", width: "24px", height: "32px" }} />,
      title: "open"
    }
  ]

  return (
    <>
      <div className={styles.backDetailsContainer}>
        <div className={"h-full w-[50%] flex flex-col justify-between items-center"}>
          <div className={"h-[68%] border border-neutral-700 rounded-4xl w-full  flex flex-wrap gap-x-5 px-3"}>
            <div className={"pt-4"}>
              {isTorrent && (
                <>
                  {/*<div className={"absolute top-15 right-4"}>*/}
                  {/*  <Tooltip title={findSeed?.label ?? "seed"} placement="bottom">*/}
                  {/*    <Badge variant={"standard"} color={"primary"} badgeContent={findSeed?.value ?? "0"} anchorOrigin={{*/}
                  {/*      vertical: "bottom",*/}
                  {/*      horizontal: "left"*/}
                  {/*    }}>*/}
                  {/*      <SeedIcon style={{ fontSize: "46px" }} />*/}
                  {/*    </Badge>*/}
                  {/*  </Tooltip>*/}
                  {/*</div>*/}
                  <div className={"absolute top-2 right-3"}>
                    <MagnetIcon style={{ fontSize: "46px" }} />
                  </div>
                </>
              )}
              {details.map(
                (item, index) =>
                  item.showDetails && (
                    <div key={`details-${index}`} className="flex items-center gap-2 max-w-[50%]">
                      <Tooltip title={item.value} placement="bottom">
                        <div className="inline-flex items-center shrink-0 gap-1.5">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Tooltip>
                      
                      <span className="truncate text-neutral-400">{item.value}</span>
                    </div>
                  )
              )}
            </div>
          </div>

          <div
            className={
              "flex flex-col gap-x-5 flex-wrap w-full h-[30%] border border-neutral-700 rounded-4xl  items-center justify-evenly"
            }
          >
            <div className={"px-6 w-full"}>
              <ProgressBar progressColor={"green"} label={""} darkTheme score={percentage} />
            </div>
            
            <SpeedDial
              ariaLabel="More actions"
              icon={<SpeedDialIcon />}
              direction="right"
              open={open}
              onClick={() => setOpen((prev) => !prev)}
              FabProps={{
                size: "small",
                sx: {
                  backgroundColor: "#222",
                  color: "#00f5ff",
                  ":hover": {
                    backgroundColor: "#222"
                  }
                }
              }}
              sx={{
                bottom: 15,
                left: 15
              }}
            >
              {actionButtonData.map((action) => (
                <SpeedDialAction
                  key={action.title}
                  icon={action.Icon}
                  tooltipTitle={action.title}
                  tooltipPlacement="bottom"
                  onClick={action.action}
                  sx={{
                    backgroundColor: "#222",
                    padding: "4px"
                  }}
                />
              ))}
            </SpeedDial>
          </div>
        </div>
        
        <div className={"w-[50%] h-full flex justify-center border border-neutral-700 rounded-4xl"}>
          <div className={"h-full w-full px-8  flex flex-col items-center justify-evenly"}>
            {isTorrent && (
              <div className={"absolute top-2 left-3"}>
                <MagnetIcon style={{ fontSize: "46px" }} />
              </div>
            )}
            <SpeedGraph speed={Number(downloadStatus?.downloadSpeed) || 0} />
            <ChunkMap percent={percentage} width={"100%"} gridTemp={"repeat(20, 1fr)"} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BackDetails
