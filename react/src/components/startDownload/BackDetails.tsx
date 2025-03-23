import { TDetails } from "@components/startDownload/startDownload.tsx"
import { Button } from "@mui/material"
import { TtellRes } from "@src/types.ts"
import styles from "./style.module.scss"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { getIdFromLocation } from "@src/utils.ts"
import { useLocation } from "react-router-dom"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>
}
const BackDetails = (props: Props) => {
  const { details, downloadStatus, setShowMore } = props
  const location = useLocation()
  const gid = getIdFromLocation(location, ":")
  const closePopup = window.electronAPI.closePopupWindow
  
  const percentage = downloadStatus ? +(+downloadStatus?.completedLength / +downloadStatus?.totalLength * 100).toFixed(0) : 0
  return (
    <>
      <div className={styles.backDetailsContainer}>
        <div className={"h-full w-[50%] border border-neutral-800 rounded-4xl"}
             style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ marginTop: "20px", marginLeft: "10px", height: "fit-content", width: "100%" }}>
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
        
        {/*<Divider variant={"middle"} flexItem={true} orientation={"vertical"} />*/}
        <div className={"w-[50%] h-full flex justify-center border border-neutral-800 rounded-4xl"}>
          <div className={"h-full w-[50%] flex flex-col items-center justify-evenly"}>
            
            {/*<Progress progress={75} />*/}
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              strokeWidth={8}
              styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  stroke: `#10F61A`,
                  stopColor: "red",
                  strokeOpacity: "60%",
                  
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: "round",
                  // Customize transition animation
                  transition: "stroke-dashoffset 0.5s ease 0s",
                  // Rotate the path
                  transform: "rotate(0turn)",
                  transformOrigin: "center center"
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                  // Trail color
                  stroke: "#d6d6d6",
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: "butt",
                  // Rotate the trail
                  transform: "rotate(0.25turn)",
                  transformOrigin: "center center"
                },
                // Customize the text
                text: {
                  // Text color
                  fill: "#ffffff",
                  // Text size
                  fontSize: "12px"
                },
                // Customize background - only used when the `background` prop is true
                background: {
                  fill: "#3e98c7"
                }
              }}
            />
          </div>
        </div>
      
      </div>
      {/*<Divider variant={"middle"} orientation={"horizontal"} />*/}
      <div className={"flex justify-center  items-center w-full h-[20%]"}>
        
        <div className={"flex gap-2 justify-center w-full px-3 mt-10"}>
          <Button variant={"outlined"} color={"error"} onClick={() => closePopup(gid)}>close</Button>
          <Button variant={"outlined"} color={"warning"} onClick={() => setShowMore(false)}>back</Button>
        </div>
      </div>
    </>
  )
}

export default BackDetails
