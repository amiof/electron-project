import { useEffect, useState } from "react"
import { Alert, Button, CircularProgress, IconButton, Snackbar, Tooltip } from "@mui/material"
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { TDownloads } from "@src/types.ts"

const SharePopup = () => {
  const [copied, setCopied] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [rowsToShare, setRowsToShare] = useState<TDownloads[]>([])
  const [loading, setLoading] = useState(true)
  
  const allDownloadsRow = useDownloaderStore((state) => state.allDownloadsRow)
  
  useEffect(() => {
    const fetchSelectedRows = async () => {
      try {
        // Get selected rows from main process
        const selectedRows = await window.electronAPI.getSelectedRowsForShare()
        
        if (selectedRows && selectedRows.length > 0) {
          // Use selected rows if available
          setRowsToShare(selectedRows as TDownloads[])
        }
        else {
          // Fall back to all downloads if no rows were selected
          setRowsToShare(allDownloadsRow)
        }
      }
      catch (error) {
        console.error("Failed to get selected rows:", error)
        setRowsToShare(allDownloadsRow)
      }
      finally {
        setLoading(false)
      }
    }
    
    fetchSelectedRows()
  }, [allDownloadsRow])
  
  const formatShareText = (rows: TDownloads[]): string => {
    if (rows.length === 0) return "No downloads to share"
    
    const lines: string[] = []
    lines.push(`Download Info (${rows.length} item${rows.length > 1 ? "s" : ""})`)
    lines.push("─".repeat(40))
    
    rows.forEach((row, index) => {
      lines.push(`\n[${index + 1}] ${row.FileName}`)
      lines.push(`  URL: ${row.Url || "N/A"}`)
      lines.push(`  Size: ${row.Size || "N/A"}`)
      lines.push(`  Status: ${row.Status || "N/A"}`)
      lines.push(`  Save Path: ${row.SavePath || "N/A"}`)
      if (row.CompletedSize) {
        lines.push(`  Completed: ${row.CompletedSize}`)
      }
      if (row.Percentage !== undefined) {
        lines.push(`  Progress: ${row.Percentage}%`)
      }
      if (row.isTorrent) {
        lines.push(`  Type: Torrent`)
      }
    })
    
    lines.push("\n" + "─".repeat(40))
    lines.push("Shared from Shabdiz Download Manager")
    
    return lines.join("\n")
  }
  
  const shareText = formatShareText(rowsToShare)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setSnackbarOpen(true)
      setTimeout(() => setCopied(false), 2000)
    }
    catch (error) {
      console.error("Failed to copy:", error)
    }
  }
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Share Downloads Info</h2>
        <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
          <IconButton
            onClick={copyToClipboard}
            sx={{
              color: copied ? "#4caf50" : "white",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.12)"
              }
            }}
          >
            {copied ? <CheckCircleOutlineIcon /> : <ContentCopyOutlinedIcon />}
          </IconButton>
        </Tooltip>
      </div>
      
      <div
        className="flex-1 overflow-auto p-3 rounded-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <pre
          className="text-sm whitespace-pre-wrap break-words m-0"
          style={{ color: "#e0e0e0", fontFamily: "monospace" }}
        >
          {shareText}
        </pre>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outlined"
          onClick={() => window.close()}
          sx={{ color: "white", borderColor: "rgba(255, 255, 255, 0.3)" }}
        >
          Close
        </Button>
        {/*<Button*/}
        {/*  variant="contained"*/}
        {/*  onClick={copyToClipboard}*/}
        {/*  startIcon={copied ? <CheckCircleOutlineIcon /> : <ContentCopyOutlinedIcon />}*/}
        {/*  sx={{*/}
        {/*    backgroundColor: copied ? "#4caf50" : undefined,*/}
        {/*    "&:hover": {*/}
        {/*      backgroundColor: copied ? "#43a047" : undefined*/}
        {/*    }*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {copied ? "Copied!" : "Copy to Clipboard"}*/}
        {/*</Button>*/}
      </div>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Download info copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SharePopup
