import './App.scss'
import {Button} from "@mui/material";

function App() {

    return (
        <>
            <div className={"bg-amber-700"}> this is tailwindcss</div>
            <div className={"text text-yellow-400"}>
                this is a test
            </div>
            <Button variant={"contained"} color={"success"}>select</Button>
        </>
    )
}

export default App
