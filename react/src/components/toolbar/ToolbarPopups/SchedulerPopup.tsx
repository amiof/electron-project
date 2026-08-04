import { Button, Checkbox, FormControl, TextField } from "@mui/material"
import { useState } from "react"

const SchedulerPopup = () => {
  const addSchedulerTime = window.electronAPI.addSchedulerTime
  
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)
  console.log("%c 1 --> Line: 11||SchedulerPopup.tsx\n endTime: ", "color:#f0f;", endTime)
  console.log("%c 1 --> Line: 10||SchedulerPopup.tsx\n startTime: ", "color:#f0f;", startTime)
  
  const saveHandler = () => {
    addSchedulerTime(startTime, endTime, false, false)
  }
  
  return (
    <div className={"w-full h-full"}>
      <FormControl className={"gap-3 w-full h-full"}>
        <div className={"flex items-center justify-around mt-5 px-3"}>
          <label id={"startTime-label"} className="mr-2">
            start time :
          </label>
          
          <TextField
            name="start time"
            size={"medium"}
            sx={{ width: "65%" }}
            onChange={(e) => setStartTime(e.target.value)}
            value={startTime}
            // onChange={handleInputChange("ip")}
            // placeholder="example: 127.0.0.1"
            aria-label={"startTime-label"}
            type={"time"}
            // disabled={!formValues.proxyStatus}
          />
        </div>
        
        <div className={"flex items-center justify-around mt-1 px-3"}>
          <label id={"endTime-label"} className="mr-2">
            end time :
          </label>
          <TextField
            name="end time"
            size={"medium"}
            sx={{ width: "65%" }}
            onChange={(e) => setEndTime(e.target.value)}
            // value={formValues.port || ""}
            // onChange={handleInputChange("port")}
            type="time"
            // disabled={!formValues.proxyStatus}
            // placeholder="example: 8085"
          />
        </div>
        <div className={"flex  w-full px-8 items-center justify-start "}>
          <div className={"flex items-center"}>
            <label id={"enableScheduler-label"} className="mr-2">
              keep alive
            </label>
            <Checkbox name="proxyStatus" />
          </div>
        </div>
        <div className={"flex  w-full px-8 items-center  "}>
          <div className={"flex items-center"}>
            <label id={"poweroff-label"} className="mr-2">
              powerOff after download ended
            </label>
            <Checkbox name="poweroff" />
          </div>
        </div>
        <div className={"flex justify-end mt-2 gap-2 mx-3"}>
          <Button variant={"contained"} onClick={saveHandler}>
            save
          </Button>
          <Button variant={"outlined"}>cancel</Button>
        </div>
      </FormControl>
    </div>
  )
}

export default SchedulerPopup
