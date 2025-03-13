import styles from "@src/app.module.scss"
import clsx from "clsx"
import Sidebar from "@components/sidebar/Sidebar.tsx"
import Header from "@components/header/Header.tsx"
import Toolbar from "@components/toolbar/Toolbar.tsx"
import Main from "@components/main/Main.tsx"
import "./renderer.ts"

function App() {
  
  
  return (
    <>
      <div className={clsx(styles.mainContainer)}>
        <div className={styles.aside}>
          <Sidebar />
        </div>
        <div className={clsx("border-b border-neutral-800 ", styles.header)}>
          <Header />
        </div>
        <div className={clsx(styles.subHeader, "border-l border-b border-neutral-800")}>
          <Toolbar />
        </div>
        <div className={clsx(styles.main, "border-l  border-neutral-800")}>
          <Main />
        </div>
      </div>
    </>
  )
}

export default App
