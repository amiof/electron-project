import { useLocation } from "react-router-dom"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect, useRef } from "react"
import { TtellRes } from "@src/types.ts"
import { getIdFromLocation } from "@src/utils.ts"


const DownloadStart = () => {
  
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  const tellActive = useDownloaderStore(state => state.tellActive)
  const getTellActive = useDownloaderStore(state => state.getTellActive)
  const downloadStateRef = useRef<TtellRes | null>(null)
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null
    if (tellActive.length) {
      interval = setInterval(async () => {
        const tellStatus = await window.electronAPI.getTellStatus(gid)
        await getTellActive()
        downloadStateRef.current = tellStatus
      }, 600)
    }
    else {
      getAllDownloads()
    }
    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
        downloadStateRef.current = null
      }
    }
    
  }, [tellActive.length])
  
  return (
    <div>
      {downloadStateRef.current ? downloadStateRef.current.downloadSpeed : 0}
    </div>
  )
}

export default DownloadStart
