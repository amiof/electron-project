import styles from "./style.module.scss"
import {DataGrid, GridColDef} from "@mui/x-data-grid";


const Main = () => {

    const columns: GridColDef<(typeof rows)[number]>[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
    ];

    const rows = [
        {id: 1, lastName: 'Snow', firstName: 'Jon', age: 14},
        {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31},
        {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31},
        {id: 4, lastName: 'Stark', firstName: 'Arya', age: 11},
        {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
        {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
        {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
        {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
        {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
    ];
    return (
        <div className={styles.container}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                slotProps={{
                    pagination: {
                        style: {
                            color: "white"
                        }
                    },
                }}
                sx={{
                    backgroundColor: "var(--color-neutral-900)",
                    border: "none",
                    "& .MuiDataGrid-container--top [role=row]": {
                        backgroundColor: "var(--color-neutral-800)",
                        color: "white",
                    },
                    "& .MuiDataGrid-cell": {
                        borderColor: "var(--color-neutral-800)",
                        color: "white"
                    },
                    "& .MuiDataGrid-columnSeparator": {
                        color: "var(--color-neutral-600)",
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
                        color: "green"
                    }
                }}
                pageSizeOptions={[5]}
                checkboxSelection
            />
        </div>
    );
};

export default Main
