// import { useEffect, useState } from "react"
// import useDownloaderStore from "@src/store/downloaderStore.ts"
//
//
// type Props = {
//   link: string
//   start: boolean
//   startAction: React.Dispatch<React.SetStateAction<boolean>>
//   action?: () => void,
// }
//
// const useDownload = (props: Props) => {
//   const { link, start, startAction } = props
//
//   const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
//   const tellActive = useDownloaderStore(state => state.tellActive)
//
//   const addDownloadDir = window.electronAPI.addDownloadDir
//
//   // const [gid, setGid] = useState<string>("")
//
//   if (start) {
//     (async () => {
//         const downloadRes = await addDownloadDir(link)
//         if (downloadRes) startAction(false)
//         getAllDownloads()
//         // if (downloadRes) setGid(downloadRes)
//       }
//     )()
//   }
//
//   useEffect(() => {
//     if (start) {
//       let interval: NodeJS.Timeout | null
//       console.log("im hereeeee1")
//       if (tellActive.length) {
//         interval = setInterval(async () => {
//           await getAllDownloads()
//           console.log("im hereeeee2")
//         }, 600)
//       }
//       else {
//         getAllDownloads()
//       }
//
//       return () => {
//         if (interval) {
//           clearInterval(interval)
//           interval = null
//         }
//       }
//     }
//
//   }, [tellActive.length])
//
// }
//
// export default useDownload