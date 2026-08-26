import { useLocation } from "react-router-dom"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect, useState } from "react"
import { TtellRes } from "@src/types.ts"
import { formatBytes, formatTime, getIdFromLocation, isMetadataPhase, isTorrentMode } from "@src/utils.ts"
import styles from "./style.module.scss"
import BackDetails from "@components/startDownload/BackDetails.tsx"
import clsx from "clsx"
import SpeedIcon from "@mui/icons-material/Speed"
import SaveIcon from "@mui/icons-material/Save"
import HubIcon from "@mui/icons-material/Hub"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import SaveAsIcon from "@mui/icons-material/SaveAs"
import SaveAltIcon from "@mui/icons-material/SaveAlt"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import InsertLinkIcon from "@mui/icons-material/InsertLink"

export type TDetails = {
  label: string
  value: number | string
  icon?: React.ReactElement
  showDetails?: boolean
}

const DownloadStart = () => {
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const getAllDownloads = useDownloaderStore((state) => state.getAllDownloadsRow)
  const tellActive = useDownloaderStore((state) => state.tellActive)
  const getTellActive = useDownloaderStore((state) => state.getTellActive)
  const setDownloadDataToElectron = useDownloaderStore((state) => state.setActiveDataToElectron)

  const [downloadStatus, setDownloadStatus] = useState<TtellRes | null>(null)

  const addLinkToDB = window.electronAPI.addLinkToDB
  const changeStatusDownload = window.electronAPI.updateDownloadRowStatus
  const currentDownloadRow = tellActive.find((downloadRow) => downloadRow.gid === gid)

  const remainingBytes = downloadStatus ? +downloadStatus.totalLength - Number(downloadStatus.completedLength) : 0
  const remainingSeconds =
    downloadStatus && +downloadStatus.downloadSpeed > 0
      ? remainingBytes / Number(downloadStatus?.downloadSpeed)
      : Infinity

  // const completeDownload = downloadStatus?.status === STATUS_TYPE.COMPLETE
  const getDownloadedFilesDetails = useDownloaderStore((state) => state.getDownloadedFilesDetails)

  useEffect(() => {
    //for add create add in dataGrid
    getDownloadedFilesDetails()
  }, [])

  useEffect(() => {
    if (currentDownloadRow) {
      ;(async () => {
        await addLinkToDB(currentDownloadRow)
      })()
    }
  }, [tellActive.length])

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null
    if (tellActive.length) {
      interval = setInterval(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await getTellActive()
        setDownloadStatus(tellStatus)
      }, 400)

      setDownloadDataToElectron(tellActive[0])
    }
    else {
      ;(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        setDownloadStatus(tellStatus)
      })()
      getAllDownloads()
    }
    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
        setDownloadStatus(null)
      }
      //for update status in db when closed popup
      ;(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await changeStatusDownload(tellStatus.gid, tellStatus)
      })()
    }
  }, [tellActive.length])
  
  const isMetaData = downloadStatus ? isMetadataPhase(downloadStatus) : true
  const isTorrent = downloadStatus ? isTorrentMode(downloadStatus) : false
  
  const isTorrentsDetails = isTorrent
    ? ([
      { label: "Number Seeders", value: downloadStatus?.numSeeders ?? "0", showDetails: false },
      { label: "Upload", value: downloadStatus?.uploadLength ?? "0", showDetails: false }
    ] as TDetails[])
    : ([] as TDetails[])

  const details: TDetails[] = [
    {
      label: "Speed : ",
      value: downloadStatus ? formatBytes(+downloadStatus.downloadSpeed, 1) : 0,
      icon: <SpeedIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Link : ",
      value: downloadStatus?.files[0].uris[0]?.uri ?? "",
      icon: <InsertLinkIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Saved Path : ",
      value: downloadStatus?.dir ?? "",
      icon: <SaveIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Connection :",
      value: downloadStatus?.connections ?? 0,
      icon: <HubIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Status :",
      value: downloadStatus?.status ?? "",
      icon: <TaskAltIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "File Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.totalLength) : 0,
      icon: <SaveAsIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Downloaded Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.completedLength) : 0,
      icon: <SaveAltIcon color={"success"} />,
      showDetails: true
    },
    {
      label: "Eta :",
      value: formatTime(remainingSeconds),
      icon: <AccessTimeIcon color={"success"} />,
      showDetails: true
    },
    ...isTorrentsDetails
  ]
  return (
    <div className={"w-full h-full flex justify-center items-center overflow-hidden "}>
      <div className={styles.container}>
        <div className={clsx(styles.card)}>
          <div className={styles.back}>
            <BackDetails
              details={details}
              downloadStatus={downloadStatus}
              isMetaData={isMetaData}
              isTorrent={isTorrent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadStart
