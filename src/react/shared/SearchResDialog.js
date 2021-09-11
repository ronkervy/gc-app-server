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
    ArrowBack,
    Close
} from '@material-ui/icons';
import { useHistory, useParams,useLocation } from 'react-router';
import ListProd from '../products/components/Product List/ListProd';
import TransactionList from '../transactions/components/TransactionList';

const Transition = forwardRef(function Transition(props,ref){
    return <Slide
        direction="up" ref={ref} {...props}
    />
});

const useQuery = ()=>{
    return new URLSearchParams(useLocation().search);
}

function SearchResDialog(props) {

    const [openDialog,setOpenDialog] = useState(false);
    const history = useHistory();
    const query = useQuery();
    const {search} = useParams();
    const model = query.get('model');

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
            TransitionProps={{
                timeout : 500
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
                                <ArrowBack />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} sm={10}>                            
                        </Grid>
                    </Grid>                                  
                </Toolbar>
            </AppBar>        
            {model === 'products' ? (<ListProd search={search} mode="search" />) : (<TransactionList search={search} mode="search" />)}            
        </Dialog>
    )
}

export default SearchResDialog
