import React,{useState} from 'react';
import {
    withStyles,
    AppBar, 
    Toolbar,
    InputAdornment,
    TextField,
    FormControl
} from '@material-ui/core';
import Styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import SearchModal from './SearchModal';

function SearchHeader(props) {

    const {classes,searchRef} = props;
    const [open,setOpen] = useState(false);

    const handleOpen = ()=>{
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }    

    return (
        <AppBar position="static" className={classes.AppHeader}>
            <Toolbar 
                variant="dense"
                disableGutters
            >
                <FormControl variant="standard" fullWidth size="small" className={classes.AppHeader} >
                    <TextField      
                        size="small" 
                        placeholder="`Press Ctrl + F`"                        
                        onClick={(e)=>{
                            handleOpen();
                            e.target.blur();
                        }}

                        onFocus={(e)=>{
                            handleOpen();
                            e.target.blur();
                        }}

                        inputRef={searchRef}   
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon color="#1759A3" icon={faSearch} />
                                </InputAdornment>
                            ),
                            disableUnderline : true,
                            style : {
                                textAlign : "center"
                            }
                        }}                                    
                    ></TextField>
                </FormControl>
            </Toolbar>
            
            <SearchModal 
                open={open} 
                handleClose={handleClose}
            />
            
        </AppBar>
    )
}

export default withStyles(Styles)(SearchHeader)
