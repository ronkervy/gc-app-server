import React,{useState,useEffect,forwardRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Dialog, Fab, Grid, IconButton, Paper, Slide, Toolbar, Typography,TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Add, ArrowBack } from '@material-ui/icons';
import SearchTableForm from './SearchTableForm';
import { ClearCart } from '../store/DeliveriesSlice';
import { CreateDelivery, GetAllDeliveries } from '../store/DelServices';
import Loader from '../../shared/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import NumberFormat from 'react-number-format';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const [soldTo,setSoldTo] = useState('Gloriocity Construction Supply');
    const [address,setAddress] = useState('');

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

    const handleChangeSold = (e)=>{
        setSoldTo(e.target.value);
    }

    const handleChangeAddress = (e)=>{
        setAddress(e.target.value);
    }

    const cartTotalDiscount = ()=>{
        const discountArr = [];
        cart.map(item=>{
            const discount = parseFloat(item.item_discount / 100);
            discountArr.push(((item.price * discount)) * item.qty);
        });
        return discountArr.reduce((a,b)=>a+b,0);
    }

    const cartTotal = ()=>{
        const priceArr = [];
        cart.map(item=>{
            priceArr.push(item.price * item.qty);
        });
        return priceArr.reduce((a,b)=>a+b,0) - cartTotalDiscount();
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
                    padding : "50px",
                    backgroundColor : "#EBEBF7"
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
                        <Grid item lg={2} xl={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
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
                        <Grid item lg={10} xl={10} sm={10}>                          
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container style={{
                padding : "20px",
                backgroundColor : "#EBEBF7",
                height : "100%"
            }}>     
                <Grid component={Paper} container spacing={2} style={{ padding : "10px 30px", margin : "5px 4px 10px 4px" }}>
                    <Grid item lg={12} xl={12} sm={12}>
                        <Typography style={{ margin : "0px" }} variant="h5"><FontAwesomeIcon color="green" icon={faReceipt} /> ORDER INFO</Typography>
                    </Grid>
                    <Grid item lg={6} xl={6} sm={6}>
                        <TextField 
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Sold to"
                            value={soldTo}
                            onChange={handleChangeSold}
                        />
                    </Grid>
                    <Grid item lg={6} xl={6} sm={6}>
                        <TextField 
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Address"
                            value={address}
                            onChange={handleChangeAddress}
                        />
                    </Grid>
                    <Grid item lg={2} xl={2} sm={2}>
                        <TextField 
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="Cart Count"
                            value={cart.length}
                        />
                    </Grid>
                    <Grid item lg={5} xl={5} sm={5}>
                        <NumberFormat 
                            fullWidth
                            label="Total Amount"
                            variant="outlined"
                            customInput={TextField}
                            size="small"
                            thousandSeparator={true}
                            prefix="Php "
                            decimalScale={2}
                            decimalSeparator={'.'}
                            fixedDecimalScale={true}
                            value={cartTotal()}
                        />
                    </Grid>
                    <Grid item lg={5} xl={5} sm={5}>
                        <NumberFormat 
                            fullWidth
                            label="Total Discount"
                            variant="outlined"
                            customInput={TextField}
                            size="small"
                            thousandSeparator={true}
                            prefix="Php "
                            decimalScale={2}
                            decimalSeparator={'.'}
                            fixedDecimalScale={true}
                            value={cartTotalDiscount()}
                        />
                    </Grid>
                    <Grid item lg={4} xl={4} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOrder}
                        >Create Order</Button>&nbsp;&nbsp;
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor : "orange",
                                color : "white"
                            }}
                            onClick={()=>{
                                dispatch( ClearCart() )
                            }}
                        >Clear</Button>
                    </Grid>
                </Grid>
                <SearchTableForm infoField={ { address,soldTo } } {...props} />                
            </Grid>
        </Dialog>
    )
}

export default AddDeliveries;
