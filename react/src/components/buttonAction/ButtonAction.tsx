import styles from "./style.module.scss"
import { ReactElement } from "react"

type Props = {
  iconElement: ReactElement
  title: string
  action: (() => void) | undefined
}


const ButtonAction = (props: Props) => {
  
  const { title, iconElement, action } = props
  
  return (
    <div className={styles.buttonContainer} onClick={action}>
      <div className={styles.iconElement}>{iconElement}</div>
      <span className={styles.title}>{title}</span>
    </div>
  )
}

export default ButtonAction