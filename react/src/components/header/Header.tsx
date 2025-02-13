import styles from "./style.module.scss"
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {SearchOutlined} from "@mui/icons-material";

const Header = () => {
    return (
        <div className={styles.container}>
            <TextField size={"small"} placeholder={"search"}
                       sx={{
                           backgroundColor: "rgba(255, 255, 255, 0.08)",
                           borderRadius: "30px", color: "white", width: "200px",
                           '& input': {
                               marginLeft: "10px"
                           },
                           '& .MuiOutlinedInput-root': {
                               '&.Mui-focused fieldset': { // Remove the focus outline
                                   border: '0.5px solid green', // Remove the border
                                   borderRadius: "30px",
                                   outline: 'none', // Remove the outline
                               },
                               '&:hover fieldset': {
                                   borderColor: 'green', // Make the border transparent on hover
                                   borderRadius: "30px",
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