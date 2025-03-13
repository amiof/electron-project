import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { HashRouter, Route, Routes } from "react-router-dom"
import AddLinkPopup from "@components/addLinkPopup/AddLinkPopup.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/popup" element={<AddLinkPopup />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
