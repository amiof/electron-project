import { useLocation } from "react-router-dom"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect, useState } from "react"
import { STATUS_TYPE, TtellRes } from "@src/types.ts"
import { formatBytes, formatTime, getIdFromLocation, isMetadataPhase, isTorrentMode } from "@src/utils.ts"
import styles from "./style.module.scss"
import BackDetails from "@components/startDownload/BackDetails.tsx"
import FrontDetails from "@components/startDownload/FrontDetails.tsx"
import clsx from "clsx"
import FolderIcon from "@src/assets/folderIcon.tsx"
import LinkIcon from "@src/assets/LinkIcon.tsx"
import SpeedTestIcon from "@src/assets/SpeedTestIcon.tsx"
import ConnectionIcon from "@src/assets/ConnectionIcon.tsx"
import StatusIcon from "@src/assets/StatusIcon.tsx"
import FileSizeIcon from "@src/assets/FileSizeIcon.tsx"
import DownloadSizeIcon from "@src/assets/DownloadSizeIcon.tsx"
import TimeEtaIcon from "@src/assets/TimeEtaIcon.tsx"

export type TDetails = {
  label: string
  value: number | string
  icon?: React.ReactElement
  showDetails?: boolean
}

const DownloadStart = () => {
  
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  const tellActive = useDownloaderStore(state => state.tellActive)
  const getTellActive = useDownloaderStore(state => state.getTellActive)
  const setDownloadDataToElectron = useDownloaderStore(state => state.setActiveDataToElectron)
  
  const [downloadStatus, setDownloadStatus] = useState<TtellRes | null>(null)
  const [showMore, setShowMore] = useState<boolean>(false)
  
  const addLinkToDB = window.electronAPI.addLinkToDB
  const changeStatusDownload = window.electronAPI.updateDownloadRowStatus
  const currentDownloadRow = tellActive.find(downloadRow => downloadRow.gid === gid)
  
  const remainingBytes = downloadStatus ? +downloadStatus.totalLength - Number(downloadStatus.completedLength) : 0
  const remainingSeconds = downloadStatus && +downloadStatus.downloadSpeed > 0 ? remainingBytes / Number(downloadStatus?.downloadSpeed) : Infinity
  
  const completeDownload = downloadStatus?.status === STATUS_TYPE.COMPLETE
  const getDownloadedFilesDetails = useDownloaderStore(state => state.getDownloadedFilesDetails)
  
  useEffect(() => {
    //for add create add in dataGrid
    getDownloadedFilesDetails()
  }, [])
  
  useEffect(() => {
    
    if (currentDownloadRow) {
      (async () => {
        await addLinkToDB(currentDownloadRow)
      })()
    }
  }, [tellActive.length])
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null
    if (tellActive.length) {
      interval = setInterval(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await getTellActive()
        setDownloadStatus(tellStatus)
      }, 400)
      
      setDownloadDataToElectron(tellActive[0])
    }
    else {
      (async () => {
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
      (async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await changeStatusDownload(tellStatus.gid, tellStatus)
      })()
      
    }
    
  }, [tellActive.length])
  
  
  useEffect(() => {
    if (completeDownload) {
      setShowMore(true)
    }
  }, [completeDownload])
  
  
  const isMetaData = downloadStatus ? isMetadataPhase(downloadStatus) : true
  const isTorrent = downloadStatus ? isTorrentMode(downloadStatus) : false
  
  const isTorrentsDetails = isTorrent ? [
    { label: "Number Seeders", value: downloadStatus?.numSeeders ?? "0", showDetails: false },
    { label: "Upload", value: downloadStatus?.uploadLength ?? "0", showDetails: false }
  ] as TDetails[] : [] as TDetails[]
  
  const details: TDetails[] = [
    {
      label: "Speed : ",
      value: downloadStatus ? formatBytes(+downloadStatus.downloadSpeed, 1) : 0,
      icon: <SpeedTestIcon />,
      showDetails: true
    },
    {
      label: "Link : ",
      value: downloadStatus?.files[0].uris[0]?.uri ?? "",
      icon: <LinkIcon />,
      showDetails: true
    },
    {
      label: "Saved Path : ",
      value: downloadStatus?.dir ?? "",
      icon: <FolderIcon />,
      showDetails: true
    },
    {
      label: "Connection :",
      value: downloadStatus?.connections ?? 0,
      icon: <ConnectionIcon />,
      showDetails: true
    },
    {
      label: "Status :",
      value: downloadStatus?.status ?? "",
      icon: <StatusIcon />,
      showDetails: true
    },
    {
      label: "File Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.totalLength) : 0,
      icon: <FileSizeIcon />,
      showDetails: true
    },
    {
      label: "Downloaded Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.completedLength) : 0,
      icon: <DownloadSizeIcon />,
      showDetails: true
    },
    {
      label: "Eta :",
      value: formatTime(remainingSeconds),
      icon: <TimeEtaIcon />,
      showDetails: true
    },
    ...isTorrentsDetails
  ]
  return (
    <div className={"w-full h-full flex justify-center items-center overflow-hidden "}>
      <div className={styles.container}>
        <div className={clsx(styles.card, showMore && "rotate-x-180")}>
          <div className={clsx(styles.front, " border border-neutral-800 rounded-4xl")}>
            <FrontDetails details={details} isMetaData={isMetaData} isTorrent={isTorrent}
                          downloadStatus={downloadStatus} setShowMore={setShowMore} />
          </div>
          <div className={styles.back}>
            <BackDetails details={details} downloadStatus={downloadStatus} setShowMore={setShowMore}
                         isMetaData={isMetaData} isTorrent={isTorrent} />
          </div>
        </div>
      </div>
    </div>
  
  )
}

export default DownloadStart
