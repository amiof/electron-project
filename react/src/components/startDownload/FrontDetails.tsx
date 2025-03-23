import { Button, Divider } from "@mui/material"
import { ProgressBar } from "react-progressbar-fancy"
import { TDetails } from "@components/startDownload/startDownload.tsx"
import { TtellRes } from "@src/types.ts"

type Props = {
  details: TDetails[]
  downloadStatus: TtellRes | null
}
const FrontDetails = (props: Props) => {
  const { details, downloadStatus } = props
  return (
    <>
      <div className={"h-[45%] w-full  "}>
        <div className={"ml-15 mt-10 "} style={{ marginTop: "20px", marginLeft: "50px" }}>
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
            progressColor={"green"}
            label={""}
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
    </>
  )
}

export default FrontDetails
