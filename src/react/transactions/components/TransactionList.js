import { AppBar, Dialog, Grid, IconButton, Slide, Toolbar } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { getAllTransaction } from '../store/TransactionServices';

const TransComp = forwardRef((props,ref)=>{
    return <Slide direction="up" {...props} ref={ref} />
});

function TransactionList(props) {

    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector(state=>state.transactions);
    const history = useHistory();

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }
    
    useEffect(()=>{
        dispatch( getAllTransaction({
            opt : {
                url : '/transactions'
            }
        }) );
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={TransComp}
        >
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Grid container spacing={2}>
                        <Grid item lg={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
                            <IconButton
                                disableRipple={true}
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} sm={10}>                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item lg={12} sm={12}>
                    Transactions : {history.location.pathname}
                </Grid>
            </Grid>
        </Dialog>
    )
}

export default TransactionList
