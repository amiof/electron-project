// import useDownloaderStore from "@src/store/downloaderStore"
import styles from "./style.module.scss"
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid"
import { MouseEvent, useEffect, useState } from "react"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { TDownloads, TtellRes } from "@src/types.ts"
import { ProgressBar } from "react-progressbar-fancy"
import clsx from "clsx"
import { searchInDownloadsRows } from "@src/utils.ts"


const Main = () => {
  
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  const downloadsRow = useDownloaderStore(state => state.allDownloadsRow)
  const tellActive = useDownloaderStore(state => state.tellActive)
  const setSelectedRows = useDownloaderStore(state => state.setSelectedRow)
  const selectedRows = useDownloaderStore(state => state.selectedRows)
  const searchValue = useDownloaderStore(state => state.searchValue)
  const sidebarSelectedLabel = useDownloaderStore(state => state.sidebarSelectedLabel)
  const downloadsGroupingByLabel = useDownloaderStore(state => state.downloadsGroupByLabel)
  
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  
  let dataGridRow: TDownloads[]
  
  if (sidebarSelectedLabel === "All Downloads" || sidebarSelectedLabel === "all" || sidebarSelectedLabel === "") {
    dataGridRow = downloadsRow
  }
  else if (sidebarSelectedLabel === "Finished") {
    dataGridRow = downloadsRow.filter((item) => item.Status === "complete")
  }
  else if (sidebarSelectedLabel === "UnFinished") {
    dataGridRow = downloadsRow.filter((item) => item.Status !== "complete")
  }
  else {
    dataGridRow = downloadsGroupingByLabel[sidebarSelectedLabel.toLowerCase()]
    if (!dataGridRow) dataGridRow = []
  }
  
  const [activeDownloads, setActiveDownloads] = useState<TtellRes | null>(null)
  
  window.electronAPI.onDataChange(async (data) => {
    const result = await data
    setActiveDownloads(result)
  })
  
  // remove selected item context menu and update main download list
  const clickedContextMenuItem = () => {
    getAllDownloads()
    setRowSelectionModel([])
    setSelectedRows([])
  }
  
  useEffect(() => {
    window.electronAPI.onContextMenuAction((payload) => {
      if (typeof payload === "string") {
        // simple actions
        switch (payload) {
          case "add-link":
            console.log(payload)
            clickedContextMenuItem()
            break
          case "reload-app":
            window.location.reload()
            clickedContextMenuItem()
            break
          case "delete-rows":
            console.log(payload)
            clickedContextMenuItem()
            break
          case "resume":
            console.log(payload)
            clickedContextMenuItem()
            break
          case "stop-downloads":
            console.log(payload)
            clickedContextMenuItem()
            break
          case "open-folders":
            console.log(payload)
            clickedContextMenuItem()
            break
          case "open-options":
            console.log("open options")
            clickedContextMenuItem()
            break
          case "add-scheduler":
            console.log(payload)
            clickedContextMenuItem()
            break
          default:
            return undefined
        }
      }
      else {
        // complex actions with data
        switch (payload.action) {
          case "delete-selected":
            console.log(payload)
            break
          case "stop-selected":
            console.log(payload)
            break
          case "resume-selected":
            console.log(payload)
            break
          case "open-folders":
            console.log(payload)
            break
        }
      }
    })
    
  }, [])
  
  useEffect(() => {
    //for get session data in start app
    setTimeout(async () => {
      await getAllDownloads()
    }, 1000)
  }, [])
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null
    if (tellActive.length) {
      interval = setInterval(async () => {
        await getAllDownloads()
      }, 900)
    }
    else {
      getAllDownloads()
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
  }, [tellActive.length, activeDownloads])
  
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "Id", headerName: "id", width: 50, sortable: true },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      sortable: false,
      editable: false
    },
    {
      field: "FileName",
      headerName: "File Name",
      width: 150,
      sortable: true,
      editable: false
    },
    {
      field: "Url",
      headerName: "Url",
      width: 150,
      sortable: false,
      editable: false
    },
    {
      field: "SavePath",
      headerName: "Save Path",
      type: "string",
      width: 110,
      sortable: true,
      editable: false
    },
    {
      field: "Percentage",
      headerName: "Percentage",
      width: 200,
      renderCell: (params) => {
        return (
          <div className={clsx("flex justify-between items-center  h-full", styles.progress)}>
            <ProgressBar
              label={""}
              hideText={true}
              progressColor={"green"}
              darkTheme
              score={
                +params.row.Percentage!
              }
            />
            <div>{params.row.Percentage!}%</div>
          </div>
        )
      },
      sortable: false,
      editable: false
    },
    {
      field: "CompletedSize",
      headerName: "Completed Size",
      sortable: true,
      width: 100
    },
    {
      field: "Size",
      headerName: "Total Size",
      sortable: true,
      width: 100
      // valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
      field: "NumberConnections",
      headerName: "Connection",
      width: 100,
      sortable: false,
      editable: false
    },
    {
      field: "CreatedAt",
      headerName: "Create At",
      width: 150,
      sortable: true,
      editable: false
    }
  ]
  
  const rows = searchInDownloadsRows(dataGridRow, searchValue)
  
  
  const rowSelectedHandler = (selectionModel: GridRowSelectionModel) => {
    setRowSelectionModel(selectionModel)
    const selectedDetails = rows.filter((row) => selectionModel.includes(row.Id!))
    setSelectedRows(selectedDetails)
  }
  
  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    window.electronAPI.showContextMenu(selectedRows)
  }
  
  return (
    <div className={styles.container}
         onContextMenu={(e) => handleContextMenu(e)}>
      <DataGrid
        getRowId={(row) => row.Id!}
        scrollbarSize={1}
        checkboxSelection
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={rowSelectedHandler}
        rows={rows}
        columns={columns}
        hideFooterPagination={true}
        sx={{
          border: "none",
          "& .MuiDataGrid-container--top [role=row]": {
            backgroundColor: "var(--color-neutral-900)",
            color: "white"
          },
          "& .MuiDataGrid-cell": {
            borderColor: "var(--color-neutral-800)",
            color: "white"
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none"
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none"
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "var(--color-neutral-600)"
          },
          "& .MuiDataGrid-selectedRowCount": {
            color: "white"
          },
          "& .css-1tdeh38": {
            borderColor: "var(--color-neutral-800)"
          },
          "& .MuiDataGrid-withBorderColor": {
            borderColor: "var(--color-neutral-800)"
          },
          "& .MuiDataGrid-row--borderBottom": {
            "& .MuiDataGrid-columnHeader": {
              borderColor: "var(--color-neutral-800)"
            }
          },
          "& .MuiDataGrid-row--borderBottom ": {
            "& .MuiDataGrid-filler ": {
              borderColor: "var(--color-neutral-800)"
            }
            
          },
          "& .MuiCheckbox-root ": {
            color: "white"
          },
          // scrollbar
          "& .MuiDataGrid-scrollbar": {
            transition: "all 0.3s ease",
            height: "4px !important",
            "&:hover": {
              height: "30% !important"
            }
          }
        }}
      />
    </div>
  )
}

export default Main
