import { Close } from "@mui/icons-material"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import RemoveIcon from "@mui/icons-material/Remove"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap"
import { IconButton } from "@mui/material"
import styles from "./styles.module.scss"
import { ReactNode } from "react"

type Props = {
  id?: string
  children?: ReactNode
  title?: string
  widthTilteBar?: string
}

const CustomTitlebar = (props: Props) => {
  const { id, title, widthTilteBar = "30%", children } = props

  const windowMinimize = window.electronAPI.windowMinimize
  const windowMaximize = window.electronAPI.windowMaximize
  const windowClose = window.electronAPI.windowClose
  const windowCloseById = window.electronAPI.closePopupWindow

  return (
    <div className=" flex justify-right   h-14 max-h-[30px] px-8 [-webkit-app-region:drag] gap-6 ">
      <div
        style={{ width: widthTilteBar }}
        className="bg-[#0d1420] relative
	rounded-tr-md rounded-tl-md  flex justify-between z-30 border-t border-[rgba(255,255,255,0.1)]"
      >
        <div className={styles.leftCorner} />
        <IconButton>
          <ZoomOutMapIcon sx={{ fontSize: "15px" }} />
        </IconButton>
        {title && <div className="w-full text-center min-w-[150px] pl-20">{title}</div>}
        <div className="[-webkit-app-region:no-drag] px-3 min-w-[120px]">
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
      {children}
    </div>
  )
}

export default CustomTitlebar
