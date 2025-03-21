import { useLocation } from "react-router-dom"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect, useState } from "react"
import { TtellRes } from "@src/types.ts"
import { formatBytes, getIdFromLocation } from "@src/utils.ts"
import { ProgressBar } from "react-progressbar-fancy"
import { Button, Divider } from "@mui/material"

type details = {
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
  
  
  const details: details[] = [
    {
      label: "speed : ",
      value: downloadStatus ? formatBytes(+downloadStatus.downloadSpeed, 1) : 0
    },
    {
      label: "link : ",
      value: downloadStatus?.files[0].path ?? ""
    },
    {
      label: "saved Path : ",
      value: downloadStatus?.dir ?? ""
    },
    {
      label: "connection :",
      value: downloadStatus?.connections ?? 0
    },
    {
      label: "status :",
      value: downloadStatus?.status ?? ""
    },
    {
      label: "total Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.totalLength) : 0
    },
    {
      label: "downloaded Size:",
      value: downloadStatus ? formatBytes(+downloadStatus?.completedLength) : 0
    }
  
  
  ]
  return (
    <div className={"h-screen w-screen"}>
      <div className={"h-[49%] w-full border border-transparent "}>
        <div className={"ml-15 mt-10"}>
          {
            details.map((item, index) =>
              (
                <div key={`details-${index}`}>
                  <span> {item.label} </span>
                  <span className={"ml-2"}>{item.value}</span>
                </div>
              )
            )
          }
        </div>
      
      </div>
      <div className={"w-full h-[50%] flex justify-center "}>
        <div className={"h-full w-[90%] flex flex-col items-center justify-evenly"}>
          <Divider variant={"middle"} flexItem={true} />
          <ProgressBar
            className="porgress"
            label={""}
            progressColor={"green"}
            darkTheme
            score={
              downloadStatus ? +(+downloadStatus.completedLength / +downloadStatus.totalLength * 100).toFixed(0) : 0
            }
          />
          <div className={"flex gap-2 justify-end w-full px-3 mt-10"}>
            <Button variant={"outlined"} color={"error"}>close</Button>
            <Button variant={"outlined"} color={"warning"}>pause</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadStart
