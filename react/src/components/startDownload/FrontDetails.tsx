import { Badge, Button, Divider, Tooltip } from "@mui/material"
import { ProgressBar } from "react-progressbar-fancy"
import { TDetails } from "@components/startDownload/startDownload.tsx"
import { TtellRes } from "@src/types.ts"
import { useLocation } from "react-router-dom"
import { getIdFromLocation } from "@src/utils.ts"
import SeedIcon from "@src/assets/seedIcon.tsx"
import MagnetIcon from "@src/assets/MagnetIcon.tsx"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>
  isMetaData: boolean
  isTorrent: boolean
}
const FrontDetails = (props: Props) => {
  const { details, downloadStatus, setShowMore, isTorrent, isMetaData } = props
  
  
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const stopHandler = () => {
    window.electronAPI.stopDownloadByGid(gid)
  }
  
  const findSeed = details.find((item) => item.value === "seed")
  
  return (
    <div className={"w-full h-full flex flex-col justify-center items-center"}>
      <div className={" w-full"}>
        <div className={"px-13 pt-4"}>
          {
            isTorrent &&
            <>
              <div className={"absolute top-15 right-4"}>
                <Tooltip title={findSeed?.label ?? "seed"} placement="bottom">
                  <Badge variant={"standard"} color={"primary"} badgeContent={findSeed?.value ?? "0"} anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                  }}>
                    <SeedIcon style={{ fontSize: "46px" }} />
                  </Badge>
                </Tooltip>
              </div>
              <div className={"absolute top-2 right-3"}>
                <MagnetIcon style={{ fontSize: "46px" }} />
              </div>
            </>
          }
          {
            details.map((item, index) =>
              (
                item.showDetails &&
                <div key={`details-${index}`} className={"truncate"}>
                  <Tooltip title={item.value} placement="bottom">
                    {/*<div className={"flex gap-2"}>*/}
                    <div className={"inline-block"}>
                      {item.icon}
                      <span> {item.label} </span>
                    </div>
                  </Tooltip>
                  <span className={"ml-2"}>{item.value}</span>
                </div>
              )
            )
          }
        </div>
      
      </div>
      <div className={"w-full h-full flex justify-center pt-3"}>
        <div className={"h-full w-full px-10 flex flex-col items-center gap-4"}>
          <Divider variant={"middle"} flexItem={true} />
          <ProgressBar
            progressColor={"green"}
            label={""}
            darkTheme
            score={
              !isMetaData ? downloadStatus ? +(+downloadStatus.completedLength / +downloadStatus.totalLength * 100).toFixed(0) : 0 : 0
            }
          />
          <div className={"flex gap-2 justify-end w-full absolute bottom-5 right-11"}>
            <Button variant={"contained"} onClick={stopHandler}>stop</Button>
            <Button variant={"outlined"} color={"warning"} onClick={() => setShowMore(true)}>More</Button>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default FrontDetails
