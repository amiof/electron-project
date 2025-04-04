import { Button, Divider, Tooltip } from "@mui/material"
import { ProgressBar } from "react-progressbar-fancy"
import { TDetails } from "@components/startDownload/startDownload.tsx"
import { TtellRes } from "@src/types.ts"
import { useLocation } from "react-router-dom"
import { getIdFromLocation } from "@src/utils.ts"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>
}
const FrontDetails = (props: Props) => {
  const { details, downloadStatus, setShowMore } = props
  
  
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const stopHandler = () => {
    window.electronAPI.stopDownloadByGid(gid)
  }
  
  
  return (
    <>
      <div className={"h-[45%] w-full  "}>
        <div className={"ml-15 mt-10 "} style={{ marginTop: "20px", marginLeft: "50px" }}>
          {
            details.map((item, index) =>
              (
                <div key={`details-${index}`} className={"truncate"}>
                  <Tooltip title={item.value} placement="bottom">
                  <span> {item.label} </span>
                  </Tooltip>
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
            progressColor={"green"}
            label={""}
            darkTheme
            score={
              downloadStatus ? +(+downloadStatus.completedLength / +downloadStatus.totalLength * 100).toFixed(0) : 0
            }
          />
          <div className={"flex gap-2 justify-end w-full px-3 mt-10"}>
            <Button variant={"outlined"} color={"error"} onClick={stopHandler}>stop</Button>
            <Button variant={"outlined"} color={"warning"} onClick={() => setShowMore(true)}>More</Button>
          </div>
        </div>
      
      </div>
    </>
  )
}

export default FrontDetails
