import { useLocation } from "react-router-dom"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect, useState } from "react"
import { TtellRes } from "@src/types.ts"
import { formatBytes, formatTime, getIdFromLocation } from "@src/utils.ts"
import styels from "./style.module.scss"
import BackDetails from "@components/startDownload/BackDetails.tsx"
import FrontDetails from "@components/startDownload/FrontDetails.tsx"
import clsx from "clsx"

export type TDetails = {
  label: string
  value: number | string
}

const DownloadStart = () => {
  
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  const tellActive = useDownloaderStore(state => state.tellActive)
  const getTellActive = useDownloaderStore(state => state.getTellActive)
  const [downloadStatus, setDownloadStatus] = useState<TtellRes | null>(null)
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null
    if (tellActive.length) {
      interval = setInterval(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await getTellActive()
        setDownloadStatus(tellStatus)
      }, 300)
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
    }
    
  }, [tellActive.length])
  
  const remainingBytes = downloadStatus ? +downloadStatus.totalLength - Number(downloadStatus.completedLength) : 0
  const remainingSeconds = downloadStatus && +downloadStatus.downloadSpeed > 0 ? remainingBytes / Number(downloadStatus?.downloadSpeed) : Infinity
  
  const details: TDetails[] = [
    {
      label: "Speed : ",
      value: downloadStatus ? formatBytes(+downloadStatus.downloadSpeed, 1) : 0
    },
    {
      label: "Link : ",
      value: downloadStatus?.files[0].uris[0].uri ?? ""
    },
    {
      label: "Saved Path : ",
      value: downloadStatus?.dir ?? ""
    },
    {
      label: "Connection :",
      value: downloadStatus?.connections ?? 0
    },
    {
      label: "Status :",
      value: downloadStatus?.status ?? ""
    },
    {
      label: "File Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.totalLength) : 0
    },
    {
      label: "Downloaded Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.completedLength) : 0
    },
    {
      label: "Eta :",
      value: formatTime(remainingSeconds)
    }
  
  
  ]
  return (
    <div className={"w-full h-full flex justify-center items-center overflow-hidden "}>
      <div className={styels.container}>
        <div className={styels.card}>
          <div className={clsx(styels.front, " border border-neutral-800 rounded-4xl")}>
            <FrontDetails details={details} downloadStatus={downloadStatus} />
          </div>
          <div className={styels.back}>
            <BackDetails details={details} downloadStatus={downloadStatus} />
          </div>
        </div>
      </div>
    </div>
  
  )
}

export default DownloadStart
