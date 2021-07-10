import { 
    AppBar, 
    Dialog, 
    Grid, 
    IconButton, 
    Tab, 
    Tabs, 
    Toolbar, 
    withStyles,
    Box,
    Typography,
    Divider,
    Slide
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import React, { useEffect, useState, forwardRef } from 'react';
import { Close } from '@material-ui/icons';
import Styles from '../Styles';
import AddEditProd from '../AddEdit/AddEditProd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faCalendar, faEdit, faMoneyCheck, faMoneyCheckAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import ProductHistory from '../ProductHistory';
// import jsbarcode from 'jsbarcode';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../store/ProdServices';
import { getSingleSupplier } from '../../../suppliers/store/SupplierServices';
import Loader from '../../../shared/Loader';

const TabPanel = (props)=>{
    const {mode,children,data,value,index,...other} = props;    
    
    useEffect(()=>{
        if( value === 0 ){
            // jsbarcode("#barcode",data.item_code,{
            //     textPosition : "bottom",
            //     textMargin : 3,
            //     fontSize : 15,
            //     fontOptions : "bold",
            //     height : 80,
            //     width : 1,
            //     displayValue : false,
            //     text : data.item_name
            // });
        }
    },[children,value]);

    return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box p={3}>
              {children}
            </Box>
          )}
        </div>
    );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Transition = forwardRef((props,ref)=>{
    return <Slide
        direction="up" ref={ref} {...props}
    />
});

function SingleProduct(props) {

    const { 
        classes
    } = props;

    const dispatch = useDispatch();
    const { loading : prodLoading } = useSelector(state=>state.products);
    const { loading : suppLoading } = useSelector(state=>state.suppliers);
    const { selectedProd : data } = useSelector(state=>state.products);
    const { entities : supp } = useSelector(state=>state.suppliers);

    const [openDialog,setOpenDialog] = useState(false);
    const [value,setValue] = useState(0);
    const dnow = new Date(data.createdAt).toLocaleDateString('en-US',{month : 'short',year : 'numeric',day : '2-digit'});
    const dupdated = new Date(data.updatedAt).toLocaleDateString('en-US',{month : 'short',year : 'numeric',day : '2-digit'});
    const history = useHistory();
    const { id } = useParams();

    const handleClose = ()=>{
        history.goBack();
        setOpenDialog(false);
    }

    const handleChange = (e,newVal)=>{
        setValue(newVal);
    }

    useEffect(()=>{
        dispatch( getProduct({
            opt : {
                url : '/products/' + id
            }
        }));
    },[id]);

    useEffect(() => {
        setOpenDialog(true)
        dispatch( getSingleSupplier({
            opt : {
                url : '/suppliers'
            }
        }) );  
    }, [])

    if( prodLoading || suppLoading ){
        return(
            <Loader />
        )
    }

    return (
            <Dialog
                fullScreen
                open={openDialog}
                onClose={handleClose}
                TransitionComponent={Transition}  
                onKeyPress={(e)=>{
                    if(e.key === 'Esc'){
                        handleClose();
                    }
                }}     
            >
                <AppBar color="inherit" style={{position : "relative"}}>
                    <Toolbar variant="dense">
                        <Grid container spacing={2}>
                            <Grid item lg={10} sm={10}>
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleChange}
                                    style={{WebkitAppRegion: "no-drag"}}                            
                                >
                                    <Tab icon={<FontAwesomeIcon icon={faEdit} />} label="Edit Product" {...a11yProps} />
                                    <Tab icon={<FontAwesomeIcon icon={faMoneyCheck} />} label="Product Purchase History" {...a11yProps} />                                
                                </Tabs>
                            </Grid>
                            <Grid item lg={2} sm={2} style={{
                                WebkitAppRegion: "no-drag",
                                display: "flex",
                                justifyContent : "flex-end",
                                alignItems : "center",
                                flexDirection : "row"                            
                            }}>
                                <IconButton
                                    disableRipple={true}
                                    size="small"
                                    edge="start"
                                    color="inherit"
                                    onClick={handleClose}
                                    aria-label="close"
                                >
                                    <Close style={{ color : "red" }} />
                                </IconButton>                                                
                            </Grid>                        
                        </Grid>                                  
                    </Toolbar>
                </AppBar>
                <TabPanel data={data} value={value} index={0} >
                    <Grid container spacing={1}>
                        <Grid 
                            item
                            lg={3} 
                            sm={3}
                            style={{marginTop : "7px"}}          
                            className={classes.SingleProdTabWrap}              
                        >
                            <Grid 
                                item 
                                lg={12} 
                                sm={12}                         
                                className={classes.SingleProdBarcodeBottom}                                
                            >
                                <h2 style={{ marginTop : "0px", textAlign : "center" }}>ITEM QTY</h2>
                                <Divider variant="inset" />
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="blue" icon={faBoxes} />&nbsp;
                                    <small>                                    
                                        On Stock : {data.item_qty}
                                    </small>
                                </Grid>                                                                                
                            </Grid>
                            <Divider variant="inset" />
                            <Grid 
                                item 
                                lg={12} 
                                sm={12} 
                                className={classes.SingleProdBarcodeTop}
                            >
                                <canvas id="barcode"></canvas>
                            </Grid>
                            <Grid 
                                item 
                                lg={12} 
                                sm={12}                         
                                className={classes.SingleProdBarcodeBottom}                                
                            >
                                <h2 style={{ margin : "5px" }}>ITEM INFO</h2>
                                <Divider variant="inset" />
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="grey" icon={faUserTie} />&nbsp;
                                    <small style={{textAlign : "center", color: "green"}}>                                    
                                        Supplier ID : {data.item_supplier}
                                    </small>
                                </Grid> 
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="maroon" icon={faCalendar} />&nbsp;
                                    <small>Date Created : {dnow}</small>
                                </Grid>
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="maroon" icon={faCalendar} />&nbsp;
                                    <small>Last Updated : {dupdated}</small>
                                </Grid>                           
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="green" icon={faMoneyCheckAlt} />&nbsp;                                
                                    <small>                                   
                                        <NumberFormat 
                                            displayType="text" 
                                            value={data.item_price} 
                                            thousandSeparator={true} 
                                            prefix={'Current Price : Php '} 
                                            decimalScale={2} 
                                            decimalSeparator={'.'}
                                            fixedDecimalScale={true}
                                        />                                     
                                    </small>
                                </Grid>
                                <Grid item lg={12} sm={12}>
                                    <FontAwesomeIcon color="green" icon={faMoneyCheckAlt} />&nbsp;                                 
                                    <small>                                    
                                        <NumberFormat 
                                            displayType="text" 
                                            value={data.item_selling_price} 
                                            thousandSeparator={true} 
                                            prefix={'Current SRP : Php '} 
                                            decimalScale={2} 
                                            decimalSeparator={'.'}
                                            fixedDecimalScale={true}
                                        />                                     
                                    </small>
                                </Grid>                                                    
                            </Grid>                                               
                        </Grid>
                        <Grid item lg={9} sm={9}>
                            <AddEditProd 
                                key={id}
                                supp={supp} 
                                mode="edit" 
                                data={data} 
                                handleClose={handleClose} 
                            />
                        </Grid>                    
                    </Grid>
                </TabPanel>
                <TabPanel data={data} value={value} index={1}>
                    <ProductHistory />
                </TabPanel>
            </Dialog>
        )
}

export default withStyles(Styles)(SingleProduct)
