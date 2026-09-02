import CustomTitlebar from "@components/customTilebar/CustomTitlebar"
import { Button, Checkbox, FormControl, TextField } from "@mui/material"
import { getIdFromLocation } from "@src/utils.ts"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import styles from "../style.module.scss"
import clsx from "clsx"

const SchedulerPopup = () => {
  const addSchedulerTime = window.electronAPI.addSchedulerTime
  const closePopupWindow = window.electronAPI.closePopupWindow

  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [keepAlive, setKeepAlive] = useState<boolean>(false)
  const [powerOff, setPowerOff] = useState<boolean>(false)

  const location = useLocation()
  const id = getIdFromLocation(location, ":")

  const isEndTimeValid = !startTime || !endTime || endTime > startTime
  const isSaveDisabled = !startTime || !endTime || !isEndTimeValid

  const saveHandler = async () => {
    if (isSaveDisabled) {
      return
    }

    await addSchedulerTime(startTime, endTime, keepAlive, powerOff)
    await window.electronAPI.showNotification({
      title: "Scheduler Saved",
      body: "Downloads will start at the scheduled time. Keep your system powered on for the scheduler to run."
    })
    closePopupWindow(id)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <CustomTitlebar id={id} widthTilteBar="40%">
        <div className={clsx("w-25 bg-[#0d1420] mb-1 text-center rounded-xl font-bold", styles.slideUp)}>scheduler</div>
      </CustomTitlebar>
      <div
        className={
          "w-full h-full border-r border-l border-b border-[rgba(255,255,255,0.3)] rounded-xl flex flex-col p-5 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(34,197,94,0.10),transparent_32%),linear-gradient(145deg,#05080d_0%,#0a1019_45%,#0d1420_100%)]"
        }
      >
        <div className={"mb-6"}>
          <h2 className={"text-lg font-semibold"}>Download Scheduler</h2>
          <p className={"text-sm text-neutral-400 mt-1"}>Set the download start and end time.</p>
        </div>

        <FormControl className={"gap-5 w-full"}>
          <div className={"flex items-center gap-4"}>
            <TextField
              name="startTime"
              size={"small"}
              label="Start time"
              sx={{ width: "50%" }}
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
              type={"time"}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              name="endTime"
              size={"small"}
              label="End time"
              sx={{ width: "50%" }}
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
              type="time"
              error={!isEndTimeValid}
              helperText={!isEndTimeValid ? "End time is not correct" : ""}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </div>

          <div
            className={
              "border border-white/20 backdrop-blur-2xl bg-white/5 shadow-2xl rounded-md p-4 flex flex-col gap-3"
            }
          >
            <div className={"flex w-full items-center justify-start"}>
              <div className={"flex items-center"}>
                <label id={"enableScheduler-label"} className="mr-2">
                  Keep alive
                </label>
                <Checkbox name="keepAlive" checked={keepAlive} onChange={(e) => setKeepAlive(e.target.checked)} />
              </div>
            </div>
            <div className={"flex w-full items-center"}>
              <div className={"flex items-center"}>
                <label id={"poweroff-label"} className="mr-2">
                  Power off after download ended
                </label>
                <Checkbox name="powerOff" checked={powerOff} onChange={(e) => setPowerOff(e.target.checked)} />
              </div>
            </div>
          </div>
        </FormControl>

        <div className={"w-full flex justify-end gap-2 mt-auto"}>
          <Button variant={"contained"} onClick={saveHandler} disabled={isSaveDisabled}>
            Save
          </Button>
          <Button variant={"outlined"} onClick={() => closePopupWindow(id)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SchedulerPopup
