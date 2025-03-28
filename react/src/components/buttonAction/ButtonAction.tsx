import styles from "./style.module.scss"
import { ReactElement } from "react"
import { Button } from "@mui/material"

type Props = {
  iconElement: ReactElement
  title: string
  action: (() => void) | undefined
}


const ButtonAction = (props: Props) => {
  
  const { title, iconElement, action } = props
  
  return (
    <Button className={styles.buttonContainer} onClick={action} sx={{ textTransform: "lowercase", color: "white" }}>
      <div>{iconElement}</div>
      <span className={styles.title}>{title}</span>
    </Button>
  )
}

export default ButtonAction