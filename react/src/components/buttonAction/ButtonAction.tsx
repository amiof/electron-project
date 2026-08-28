import styles from "./style.module.scss"
import { ReactElement } from "react"
import { Tooltip } from "@mui/material"

type Props = {
  iconElement: ReactElement
  title: string
  action: (() => void) | undefined
  badgeActive?: boolean
  tooltipText?: string
}

const ButtonAction = (props: Props) => {
  const { title, iconElement, action, badgeActive, tooltipText } = props

  return (
    <Tooltip title={badgeActive && tooltipText ? tooltipText : ""} arrow placement="bottom">
      <div className={styles.buttonContainer} onClick={action}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconElement}>{iconElement}</div>
          {badgeActive && <span className={styles.badge} />}
        </div>
        <span className={styles.title}>{title}</span>
      </div>
    </Tooltip>
  )
}

export default ButtonAction
