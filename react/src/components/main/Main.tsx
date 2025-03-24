// import useDownloaderStore from "@src/store/downloaderStore"
import styles from "./style.module.scss"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import useDownloaderStore from "@src/store/downloaderStore.ts"
import { TtellRes } from "@src/types.ts"
import { ProgressBar } from "react-progressbar-fancy"
import clsx from "clsx"


const Main = () => {
  
  const getAllDownloads = useDownloaderStore(state => state.getAllDownloadsRow)
  const downloadsRow = useDownloaderStore(state => state.allDownloadsRow)
  const tellActive = useDownloaderStore(state => state.tellActive)
  
  const [activeDownloads, setActiveDownloads] = useState<TtellRes | null>(null)
  window.electronAPI.onDataChange(async (data) => {
    const result = await data
    setActiveDownloads(result)
  })
  
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
      editable: true
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
  
  const rows = downloadsRow
  
  return (
    <div className={styles.container}>
      <DataGrid
        getRowId={(row) => row.Id!}
        scrollbarSize={0}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6
            }
          }
        }}
        slotProps={{
          pagination: {
            style: {
              color: "white"
            }
          }
        }}
        sx={{
          // backgroundColor: "var(--color-neutral-900)",
          border: "none",
          "& .MuiDataGrid-container--top [role=row]": {
            backgroundColor: "var(--color-neutral-900)",
            color: "white"
          },
          "& .MuiDataGrid-cell": {
            borderColor: "var(--color-neutral-800)",
            color: "white"
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
              height: "14px !important"
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}

export default Main
