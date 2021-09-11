import React,{forwardRef, useEffect,useState} from 'react';
import { 
    Dialog,
    Slide,
    Toolbar,
    Button,
    TextField,
    withStyles,
    Grid,
    MenuItem,
    AppBar,
    IconButton,
    TextareaAutosize,
    InputAdornment
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, updateProduct } from '../../store/ProdServices';
import Loader from '../../../shared/Loader';
import { useFormik } from 'formik';
import Styles from '../Styles';
import { OpenNotification } from '../../../shared/store/NotificationSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCodeBranch, faRuler, faUserTie } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';

const EditForm = ({product})=>{

    const dispatch = useDispatch();
    const history = useHistory();
    const { entities : suppliers, loading } = useSelector(state=>state.suppliers);

    const validate = (values)=>{
        const errors = {};

        if( values.item_name === '' ){
            errors.item_name = true;
        }

        if( values.item_price === '' ){
            errors.item_price = true;
        }

        if( values.item_qty === '' ){
            errors.item_qty = true
        }
    }

    const formik = useFormik({
        initialValues : {
            item_code : product.item_code,
            item_name : product.item_name,
            item_qty : product.item_qty,
            item_price : product.item_price,
            item_supplier : product.item_supplier,
            item_unit : product.item_unit,
            item_desc : product.item_desc
        },
        validate,
        onSubmit : async(values)=>{
            const resUpdate = await dispatch( updateProduct({
                opt : {
                    url : '/products/' + product.item_id
                },
                values
            }) );

            if( updateProduct.fulfilled.match(resUpdate) ){
                dispatch( OpenNotification({
                    message : 'Product has been updated.',
                    severity : 'success'
                }) );
                history.goBack();
            }else{
                dispatch( OpenNotification({
                    message : 'Product not updated.',
                    severity : 'error'
                }) );
            }
        }
    });

    if( loading ){
        return(
            <Loader />
        )
    }

    return(
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item lg={6} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_name}
                        label="Product Name"
                        variant="outlined"
                        id="item_name"
                        name="item_name"
                        onChange={formik.handleChange}
                        value={formik.values.item_name}
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item lg={6} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_code}
                        label="Product Code"
                        variant="outlined"
                        id="item_code"
                        name="item_code"
                        onChange={formik.handleChange}
                        value={formik.values.item_code}
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faBoxOpen} />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item lg={6} sm={6}>
                    <NumberFormat
                        customInput={TextField} 
                        thousandSeparator={true}
                        decimalScale={2}
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_price}
                        label="Item Price"
                        variant="outlined" 
                        id="item_price"
                        name="item_price"
                        onChange={formik.handleChange}
                        value={formik.values.item_price}
                    />
                </Grid>
                <Grid item lg={6} sm={6}>
                    <TextField
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_qty} 
                        label="QTY"
                        variant="outlined"
                        id="item_qty"
                        name="item_qty"
                        onChange={formik.handleChange}
                        value={formik.values.item_qty}
                    />
                </Grid>
                <Grid item lg={4} sm={4}>
                    <TextField
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_unit}
                        label="Item Unit"
                        variant="outlined"
                        id="item_unit"
                        name="item_unit"
                        onChange={formik.handleChange}
                        value={formik.values.item_unit}
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faRuler} />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item lg={4} sm={4}>
                    <TextField
                        select
                        size="small"
                        fullWidth
                        onBlur={formik.handleBlur}
                        error={formik.errors.item_name}
                        label="Supplier"
                        variant="outlined"
                        id="item_supplier"
                        name="item_supplier"
                        onChange={formik.handleChange}
                        value={formik.values.item_supplier}
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faUserTie} />
                                </InputAdornment>
                            )
                        }}
                    >
                        {suppliers.map((supplier,index)=>(
                           <MenuItem
                            key={index}
                            value={supplier._id}
                           >{supplier.supplier_name}</MenuItem> 
                        ))}                        
                    </TextField>
                </Grid>
                <Grid item lg={4} sm={4}>
                    <Button 
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"                        
                    >Update</Button>
                </Grid>   
                <Grid item lg={12} sm={12}>
                    <TextareaAutosize   
                        placeholder="Description"                     
                        minRows={8}              
                        name="item_desc"
                        variant="outlined"
                        aria-label="maximum height"
                        value={formik.values.item_desc}
                        onChange={formik.handleChange}
                        style={{padding: "10px", outline : "none",width : "100%",height : "250px"}}
                    />
                </Grid>             
            </Grid>
        </form>
    )
}

const TransitionComp = forwardRef((props,ref)=>{
    return <Slide direction="up" ref={ref} {...props} />
});

const SingleProduct = (props)=>{

    const { ProductModal,SingleProdAppBar,SingleProdTable } = props.classes;
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedProd, loading } = useSelector(state=>state.products);    

    const [open,setOpen] = useState(false);
    const history = useHistory();

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    useEffect(()=>{
        setOpen(true);
        dispatch( getProduct({
            opt : {
                url : '/products/' + id
            }
        }) );
    },[id]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen  
            TransitionComponent={TransitionComp}
            style={{
                padding : "100px"
            }}
            TransitionProps={{
                timeout : 500
            }}
        >
            <AppBar position="relative" className={SingleProdAppBar} style={{ WebkitAppRegion : 'no-drag' }}>
                <Toolbar variant="dense">
                    <IconButton size="small"  edge="start" color="inherit" onClick={handleClose}>
                        <ArrowBack />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div className={ProductModal}>
                <EditForm product={selectedProd} />                
            </div>
        </Dialog>
    )
}

export default withStyles(Styles)(SingleProduct);