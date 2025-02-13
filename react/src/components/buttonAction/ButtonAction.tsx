import styles from "./style.module.scss"
import {ReactElement} from "react";

type Props = {
    iconElement: ReactElement
    title: string
}


const ButtonAction = (props: Props) => {

    const {title, iconElement} = props

    return (
        <div className={styles.buttonContainer} onClick={() => console.log("buttonAction")}>
            <div>{iconElement}</div>
            <span className={styles.title}>{title}</span>
        </div>
    );
}

export default ButtonAction;