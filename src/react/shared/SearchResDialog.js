import React,{useEffect, useState, forwardRef} from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    Grid,
    IconButton,
    Slide
} from '@material-ui/core';
import {
    Close
} from '@material-ui/icons';
import { useHistory, useParams } from 'react-router';
import ListProd from '../products/components/Product List/ListProd';

const Transition = forwardRef(function Transition(props,ref){
    return <Slide
        direction="up" ref={ref} {...props}
    />
});

function SearchResDialog(props) {

    const [openDialog,setOpenDialog] = useState(false);
    const history = useHistory();
    const {search} = useParams();

    const handleCloseDialog = ()=>{
        setOpenDialog(false);
        history.goBack();
    }

    useEffect(()=>{
        setOpenDialog(true);
    },[]);

    return (
        <Dialog
            fullScreen
            open={openDialog}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
            onKeyPress={(e)=>{
                if(e.key === 'Esc'){
                    handleCloseDialog();
                }
            }}    
            style={{
                padding : "50px"
            }}   
        >            
            <AppBar color="inherit" style={{position : "relative"}}>
                <Toolbar variant="dense">
                    <Grid container spacing={2}>
                        <Grid item lg={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
                            <IconButton
                                disableRipple={true}
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleCloseDialog}
                                aria-label="close"
                            >
                                <Close style={{ color : "red" }} />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} sm={10}>                            
                        </Grid>
                    </Grid>                                  
                </Toolbar>
            </AppBar>            
            <ListProd search={search} mode="search" />
        </Dialog>
    )
}

export default SearchResDialog
