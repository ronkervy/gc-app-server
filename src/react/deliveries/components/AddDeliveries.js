import React,{useState,useEffect,forwardRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Dialog, Fab, Grid, IconButton, Slide, Toolbar } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Add, ArrowBack } from '@material-ui/icons';
import SearchTableForm from './SearchTableForm';
import { ClearCart } from '../store/DeliveriesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { CreateDelivery, GetAllDeliveries } from '../store/DelServices';
import Loader from '../../shared/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';

const Transition = forwardRef(function Transition(props,ref){
    return <Slide
        direction="up" ref={ref} {...props}
    />
});

function AddDeliveries(props) {

    const history = useHistory();
    const dispatch = useDispatch();
    const [openDialog,setOpenDialog] = useState(false);
    const [createdOrder,setCreatedOrder] = useState({});

    const { cart, loading : deliveriesLoading } = useSelector(state=>state.deliveries);

    const handleCloseDialog = ()=>{
        dispatch( GetAllDeliveries({
            opt : {
                url : '/deliveries'
            }
        }) );
        setOpenDialog(()=>{           
            history.goBack();
            return false;
        });
        dispatch( ClearCart() );
    }

    useEffect(()=>{
        setOpenDialog(true);
    },[]);

    const handleOrder = ()=>{
        const processOrder = async()=>{
            const resOrder = await dispatch( CreateDelivery({
                opt : {
                    url : '/deliveries'
                },
                values : cart
            }));
            if( CreateDelivery.fulfilled.match(resOrder) ){
                setCreatedOrder(resOrder.payload);
                dispatch( ClearCart() );
                dispatch( OpenNotification({
                    message : 'Items has been added to ordered items.',
                    severity : 'success'
                }) );
            }else{
                dispatch( OpenNotification({
                    message : 'Order not processed.',
                    severity : 'error'
                }) );
            }
        }
        processOrder();
    }

    if( deliveriesLoading ){
        return(
            <Loader />
        )
    }

    return (
        <Dialog
            fullScreen
            open={openDialog}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
            BackdropProps={{
                style : {
                    padding : "50px"
                }
            }}
            onKeyPress={(e)=>{
                if(e.key === 'Esc'){
                    handleCloseDialog();
                }
            }}
            TransitionProps={{
                timeout : 500
            }}
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
            <Grid container style={{
                padding : "20px"
            }}>     
                <form style={{width : "100%"}}>
                    <SearchTableForm {...props} />
                    <Fab
                        variant="extended"
                        size="medium"
                        style={{
                            right : 140,
                            bottom : 20,
                            position : 'absolute'
                        }}
                        color="primary"
                        onClick={()=>{
                            handleOrder();
                        }}
                    >
                        <Add />&nbsp;
                        Order
                    </Fab>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="secondary"
                        style={{
                            right : 20,
                            bottom : 20,
                            position : 'absolute'
                        }}
                        onClick={()=>{
                            dispatch( ClearCart() );
                        }}
                    >
                        <FontAwesomeIcon icon={faEraser} />&nbsp;
                        Clear
                    </Fab>
                </form>          
            </Grid>
        </Dialog>
    )
}

export default AddDeliveries;
