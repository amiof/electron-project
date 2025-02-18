import styles from "./style.module.scss"
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";
import SpeedIcon from "@src/assets/SpeedIcon.tsx";
import StraightOutlinedIcon from '@mui/icons-material/StraightOutlined';

const Header = () => {

    return (
        <div className={styles.container}>

            <div className={styles.speedTest}>
                <SpeedIcon fontSize={"large"}/>
                <div className={styles.textSpeed}>
                    <span><StraightOutlinedIcon className={"mb-3"}/>  0 kB </span>
                    <span><StraightOutlinedIcon className={"mb-2 rotate-180"}/>  0 kB </span>
                </div>
            </div>

            <TextField size={"small"} placeholder={"search in the list"}
                       sx={{
                           backgroundColor: "rgba(255, 255, 255, 0.08)",
                           borderRadius: "15px", color: "white", width: "230px",
                           '& input': {
                               // marginLeft: "10px"
                           },
                           '& .MuiOutlinedInput-root': {
                               '&.Mui-focused fieldset': { // Remove the focus outline
                                   border: '0.5px solid green', // Remove the border
                                   borderRadius: "15px",
                                   outline: 'none', // Remove the outline
                               },
                               '&:hover fieldset': {
                                   borderColor: 'green', // Make the border transparent on hover
                                   borderRadius: "15px",
                                   outline: 'none', // Remove the outline
                               },
                           },
                       }}
                       slotProps={
                           {
                               input: {
                                   style: {color: 'white'}, // Change text color to green
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <IconButton>
                                               <SearchOutlined style={{color: 'white'}}/>
                                           </IconButton>
                                       </InputAdornment>
                                   )
                               }

                           }
                       }

            />
        </div>
    );
};

export default Header;