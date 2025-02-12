import styles from "./app.module.scss"
import clsx from "clsx";
function App() {

    return (
           <div className={clsx(styles.mainContainer ,"bg-neutral-900")}>
               <aside></aside>
               <header className={"border-b border-neutral-800"}></header>
               <div className={clsx(styles.subHeader,"border-l border-b border-neutral-800")}></div>
               <main className={"border-l  border-neutral-800"}></main>
           </div>
    )
}

export default App
