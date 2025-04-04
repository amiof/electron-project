import styles from "@components/startDownload/style.module.scss"
import { ReactElement } from "react"

type Props = {
  index: number
  action?: () => void
  Icon: ReactElement
  title: string
}
const ActionButton = (props: Props) => {
  const { index, action, Icon, title } = props
  
  return (
    <div className={styles.actionContainer} key={`actionButton-${index}`}>
      <div className={styles.buttonContainer}>
        <button className={styles.neomorphicButton} onClick={action}>
          {Icon}
        </button>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  )
}
export default ActionButton
