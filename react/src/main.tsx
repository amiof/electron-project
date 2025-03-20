import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { HashRouter, Route, Routes } from "react-router-dom"
import AddLinkPopup from "@components/addLinkPopup/AddLinkPopup.tsx"
import { createTheme, ThemeProvider } from "@mui/material"
import DownloadStart from "@components/startDownload/startDownload.tsx"

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/popup/:id" element={<AddLinkPopup />} />
        <Route path="/downloadStart/:id" element={<DownloadStart />} />
      </Routes>
    </HashRouter>
    </ThemeProvider>
  </StrictMode>
)
