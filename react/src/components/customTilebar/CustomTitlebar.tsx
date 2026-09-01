import { Close } from "@mui/icons-material"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import RemoveIcon from "@mui/icons-material/Remove"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap"
import { IconButton } from "@mui/material"
import styles from "./styles.module.scss"

type Props = {
  id?: string
}

const CustomTitlebar = (props: Props) => {
  const { id } = props

  const windowMinimize = window.electronAPI.windowMinimize
  const windowMaximize = window.electronAPI.windowMaximize
  const windowClose = window.electronAPI.windowClose
  const windowCloseById = window.electronAPI.closePopupWindow

  return (
    <div className=" flex justify-center   h-14 max-h-[30px] px-8 [-webkit-app-region:drag] ">
      <div
        className="bg-[#0d1420] w-[100%] relative
	rounded-tr-md rounded-tl-md  flex justify-between z-30 border-t border-[rgba(255,255,255,0.1)]"
      >
        <div className={styles.leftCorner} />
        <IconButton>
          <ZoomOutMapIcon sx={{ fontSize: "15px" }} />
        </IconButton>
        <div className="[-webkit-app-region:no-drag] px-3">
          <IconButton onClick={() => (id ? windowMinimize(id) : windowMinimize())}>
            <RemoveIcon sx={{ fontSize: "15px" }} />
          </IconButton>
          <IconButton onClick={() => (id ? windowMaximize(id) : windowMaximize())}>
            <FullscreenIcon sx={{ fontSize: "15px" }} />
          </IconButton>
          <IconButton onClick={() => (id ? windowCloseById(id) : windowClose())}>
            <Close sx={{ fontSize: "15px" }} />
          </IconButton>
        </div>
        <div className={styles.rightCorner} />
      </div>
    </div>
  )
}

export default CustomTitlebar
