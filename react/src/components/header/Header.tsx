import { SearchOutlined } from "@mui/icons-material"
import StraightOutlinedIcon from "@mui/icons-material/StraightOutlined"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import SpeedIcon from "@src/assets/SpeedIcon.tsx"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { formatBytes } from "@src/utils.ts"
import clsx from "clsx"
import * as _ from "lodash"
import { useEffect, useState } from "react"
import styles from "./style.module.scss"

const Header = () => {
  const tellActive = useDownloaderStore((state) => state.tellActive)

  const [downloadSpeed, setDownloadSpeed] = useState<string>("0")
  const [uploadSpeed, setUploadSpeed] = useState<string>("0")
  const [inputText, setInputText] = useState<string>("")
  const setSearchValue = useDownloaderStore((state) => state.setSearchValue)

  // update search value after 1s
  const debouncedSetSearchValue = _.debounce((value: string) => {
    setSearchValue(value)
  }, 500)

  useEffect(() => {
    debouncedSetSearchValue(inputText)

    return () => {
      debouncedSetSearchValue.cancel()
    }
  }, [inputText])

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null

    if (tellActive.length) {
      ;(async () => {
        const globalState = window.electronAPI.getGlobalStates
        interval = setInterval(async () => {
          const result = await globalState()
          setDownloadSpeed(result.downloadSpeed)
          setUploadSpeed(result.uploadSpeed)
        }, 400)
      })()
    }
    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
  }, [tellActive.length])

  return (
    <div className={styles.container}>
      <div className={styles.speedTest}>
        <SpeedIcon fontSize={"large"} />
        <div className={styles.textSpeed}>
          <span>
            <StraightOutlinedIcon
              fontSize={"small"}
              className={clsx("mb-1 rotate-180", tellActive.length && "text-green-500")}
            />
            {tellActive.length ? formatBytes(+downloadSpeed) : `0 KB`}
          </span>
          <span>
            <StraightOutlinedIcon fontSize={"small"} className={clsx("mb-1", tellActive.length && "text-red-500")} />
            {tellActive.length ? formatBytes(+uploadSpeed) : `0 KB`}
          </span>
        </div>
      </div>

      <TextField
        size={"small"}
        placeholder={"search in the list"}
        onChange={(e) => setInputText(e.target.value)}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          borderRadius: "15px",
          color: "white",
          width: "230px",
          "& input": {
            // marginLeft: "10px"
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "15px",
            "&.Mui-focused fieldset": {
              // Remove the focus outline
              border: "0.5px solid green", // Remove the border
              borderRadius: "15px",
              outline: "none" // Remove the outline
            },
            "&:hover fieldset": {
              borderColor: "green", // Make the border transparent on hover
              borderRadius: "15px",
              outline: "none" // Remove the outline
            }
          }
        }}
        slotProps={{
          input: {
            style: { color: "white" }, // Change text color to green
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchOutlined style={{ color: "white" }} />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </div>
  )
}

export default Header
