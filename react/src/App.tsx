import Header from "@components/header/Header.tsx"
import Main from "@components/main/Main.tsx"
import Sidebar from "@components/sidebar/Sidebar.tsx"
import Toolbar from "@components/toolbar/Toolbar.tsx"
import styles from "@src/app.module.scss"
import clsx from "clsx"
import "./renderer.ts"
import CustomTitlebar from "@components/customTilebar/CustomTitlebar.tsx"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { useEffect } from "react"

function App() {
  const getDownloadedFilesDetails = useDownloaderStore((state) => state.getDownloadedFilesDetails)
  const getCompletedRowsFromDB = useDownloaderStore((state) => state.getCompletedRowFromDB)
  const getSchedulerGidRow = useDownloaderStore((state) => state.getSchedulerGidRow)

  useEffect(() => {
    getCompletedRowsFromDB()
    getDownloadedFilesDetails()
    getSchedulerGidRow()
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <CustomTitlebar widthTilteBar="100%" title="shabdiz download manager" />
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
    </div>
  )
}

export default App
