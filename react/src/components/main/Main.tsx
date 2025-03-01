// import useDownloaderStore from "@src/store/downloaderStore"
import styles from "./style.module.scss"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect } from "react"
import useDownloaderStore from "@src/store/downloaderStore.ts"


const Main = () => {
  
  const getDownloads = useDownloaderStore(state => state.getDownloads)
  const downloadsRow = useDownloaderStore(state => state.downloadsRow)
  
  // useEffect(() => {
  //   console.log("downloadsRowwwww",downloadsRow)
  // }, [downloadsRow])
  
  useEffect(() => {
    (async () => {
      await getDownloads()
    })()
    
  }, [])
  
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "Id", headerName: "id", width: 90, sortable: true },
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
      field: "Size",
      headerName: "Size",
      sortable: true,
      width: 160
      // valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
      field: "Percentage",
      headerName: "Percentage",
      width: 150,
      sortable: false,
      editable: false
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      sortable: false,
      editable: false
    },
    {
      field: "NumberConnection",
      headerName: "Connection",
      width: 150,
      sortable: false,
      editable: false
    },
    {
      field: "CreatedAt",
      headerName: "Create At",
      width: 150,
      sortable: false,
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
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}

export default Main
