import React,{ useEffect,useState } from 'react';
import { useFormik } from 'formik';
import useStyles from '../Styles';
import { 
    Button, 
    Grid, 
    TextareaAutosize, 
    TextField,
    withStyles,
    Box, 
    FormControl, 
    MenuItem,
    InputAdornment
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBoxOpen,
    faList,
    faTag,
    faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    createProduct,
    getProducts,
    updateProduct
} from '../../store/ProdServices';
import { io } from 'socket.io-client';
import NumberFormat from 'react-number-format';
import { getAllSuppliers } from '../../../suppliers/store/SupplierServices';
import { OpenNotification } from '../../../shared/store/NotificationSlice';
import { useHistory } from 'react-router-dom';
import Loader from '../../../shared/Loader';
import { Autocomplete } from '@material-ui/lab';


const  AddProd = (props)=> {    

    const { classes,data,supp } = props;
    const dispatch = useDispatch();
    const [supplier,setSupplier] = useState('');
    const { entities : suppliers,loading } = useSelector(state=>state.suppliers);
    const { loading : prodLoad,entities : products } = useSelector(state=>state.products);
    const [createdProd,setCreatedProd] = useState([]);    
    const history = useHistory();

    const handleSuppChange = (e)=>{
        setSupplier(e.target.value);
        formik.handleChange(e);
    }

    const productTypeAutoComplete = ()=>{
        const typesArr = [...new Set(products.map(product=>product.item_type))];
        return typesArr;
    }

    const productBrandAutoComplete = ()=>{
        const brandsArr = [...new Set(products.map(product=>product.item_brand))];
        return brandsArr;
    }

    const initialValues = {
        item_code : '',
        item_name : '',
        item_desc : '',
        item_supplier : supplier,
        item_price : parseFloat(0),
        item_unit : '',
        item_qty : 0,
        item_srp : 0,
        item_type : '',
        item_brand : ''
    }

    const validate = values =>{

        let errors = {};

        if((/^$/).test(values.item_supplier)){
            errors.item_supplier = true;
        }

        if( (/^[a-zA-Z0-9]{0,3}$/i).test(values.item_name) ){
            errors.item_name = true;
        }

        if( (/[a-zA-Z]/i).test(values.item_qty) ){
            errors.item_qty = true;
        }

        if( (/[a-zA-Z]/i).test(values.item_price) ){
            errors.item_price = true;            
        }

        return errors;
    } 

    const formik = useFormik({
        initialValues, 
        onSubmit : async (values,actions) =>{
            const product = await dispatch( createProduct({
                opt : {
                    url : "/products"
                },
                values
            }) );

            if( createProduct.fulfilled.match(product) ){
                const newProduct = product.payload;
                setCreatedProd(newProduct);
                dispatch( OpenNotification({
                    message : "Product has been saved in the database.",
                    severity : "success"
                }) );                 
                actions.resetForm();                
            }else{
                dispatch( OpenNotification({
                    message : "Product not save.",
                    severity : "error"
                }) ); 
            } 
        },
        validate
    });

    useEffect(()=>{
        if( createdProd.length <= 0 ) return;
        const socket = io('http://localhost:8081/');
        socket.emit("created_product",{
            message : "new item created"
        });
    },[createdProd]);

    useEffect(()=>{
        dispatch( getProducts('/products') );
    },[]);

    if( loading || prodLoad ){
        return(
            <Loader />
        )
    }

    return (
        <Grid 
            className={classes.AppProd}
            container
            component={motion.div}
            initial={{x:-20,opacity : 0}}
            transition={{duration : .4}}
            animate={{x:0,opacity : 1}}            
        >
            <Box boxShadow={1} padding={3} style={{backgroundColor : "#FFFFFF"}}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item lg={4} xl={4} sm={4}>
                            <TextField 
                                fullWidth
                                size="small"
                                onBlur={formik.handleBlur}
                                error={formik.errors.item_code}
                                helperText={ formik.touched.item_code && formik.errors.item_code ? "Accepts character greater than 3" : "" }
                                id="item_code" 
                                label="Product Code" 
                                name="item_code" 
                                variant="outlined" 
                                onChange={formik.handleChange}
                                value={ formik.values.item_code }
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faBoxOpen} />
                                        </InputAdornment>
                                    )
                                }}
                                style={{textTransform: "capitalize"}}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <Autocomplete 
                                disablePortal
                                options={productTypeAutoComplete()}
                                onChange={(e,value)=>formik.setFieldValue('item_type',value)}
                                size="small"                                
                                renderInput={(params) => (
                                    <TextField 
                                        fullWidth
                                        error={formik.errors.item_type}
                                        helperText={ formik.touched.item_type && formik.errors.item_type ? "Accepts character greater than 3" : "" }
                                        variant="outlined"
                                        id="item_type" 
                                        label="Product Type" 
                                        name="item_type" 
                                        onChange={formik.handleChange}
                                        value={ formik.values.item_type }
                                        InputProps={{
                                            startAdornment : (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon icon={faList} />
                                                </InputAdornment>
                                            )
                                        }}
                                        style={{textTransform: "capitalize"}}
                                        {...params}
                                    />
                                )}
                            />                            
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                        <Autocomplete 
                                disablePortal
                                options={productBrandAutoComplete()}
                                size="small"      
                                inputValue={formik.values.item_brand}
                                onChange={(e,value)=>formik.setFieldValue('item_brand',value)}                       
                                renderInput={(params) => (
                                    <TextField 
                                        fullWidth
                                        error={formik.errors.item_brand}
                                        helperText={ formik.touched.item_brand && formik.errors.item_brand ? "Accepts character greater than 3" : "" }
                                        variant="outlined"
                                        id="item_brand" 
                                        label="Product Brand" 
                                        name="item_brand" 
                                        onChange={formik.handleChange}
                                        value={ formik.values.item_brand }
                                        InputProps={{
                                            startAdornment : (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon icon={faList} />
                                                </InputAdornment>
                                            )
                                        }}
                                        style={{textTransform: "capitalize"}}
                                        {...params}
                                    />
                                )}
                            />                                                     
                        </Grid>
                        <Grid item lg={12} xl={12} sm={12} >
                            <TextField 
                                fullWidth
                                size="small"
                                onBlur={formik.handleBlur}
                                error={formik.errors.item_name}
                                helperText={ formik.touched.item_name && formik.errors.item_name ? "Accepts character greater than 3" : "" }
                                id="item_name" 
                                label="Product name" 
                                name="item_name" 
                                variant="outlined" 
                                onChange={formik.handleChange}
                                value={ formik.values.item_name }
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faBoxOpen} />
                                        </InputAdornment>
                                    )
                                }}
                                style={{textTransform: "capitalize"}}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <FormControl variant="outlined" fullWidth size="small">
                                <TextField
                                    select
                                    error={formik.errors.item_supplier}
                                    label="Supplier"                                                                        
                                    InputProps={{
                                        startAdornment : (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faUserTie} />
                                            </InputAdornment>                                            
                                        )
                                    }}
                                    style={{textTransform: "capitalize"}}
                                    onChange={(e)=>{
                                        handleSuppChange(e);
                                    }}
                                    size="small"
                                    variant="outlined"
                                    name="item_supplier"
                                    value={formik.values.item_supplier}
                                >
                                    {suppliers.map((contact,index)=>{
                                        return(
                                            <MenuItem 
                                                key={index}
                                                value={contact._id}
                                                style={{textTransform: "capitalize"}}
                                            >{contact.supplier_name}
                                            </MenuItem>
                                        )
                                    })}                                        
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item sm={4} lg={4} xl={4}>
                            <NumberFormat
                                customInput={TextField} 
                                thousandSeparator={true}
                                decimalScale={2}
                                decimalSeparator={'.'}
                                fixedDecimalScale={true}
                                size="small"
                                fullWidth
                                error={formik.errors.item_price}
                                helperText={ formik.errors.item_price ? "Accepts only Number" : "" }
                                id="item_price"
                                name="item_price"
                                label="Item Price"
                                variant="outlined"                                
                                value={ formik.errors.item_price ? "" : formik.values.item_price}
                                onChange={formik.handleChange}                            
                            />
                        </Grid>   
                        <Grid item sm={4} lg={4} xl={4}>
                            <NumberFormat
                                customInput={TextField} 
                                thousandSeparator={true}
                                decimalScale={2}
                                decimalSeparator={'.'}
                                fixedDecimalScale={true}
                                size="small"
                                fullWidth
                                error={formik.errors.item_srp}
                                helperText={ formik.errors.item_srp ? "Accepts only Number" : "" }
                                id="item_srp"
                                name="item_srp"
                                label="Item SRP"
                                variant="outlined"                                
                                value={ formik.errors.item_srp ? "" : formik.values.item_srp}
                                onChange={formik.handleChange}                            
                            />
                        </Grid>                    
                        <Grid item sm={6} lg={8} xl={8}>
                            <TextField
                                fullWidth
                                label="Item Unit"
                                name="item_unit"
                                placeholder="PC / Roll"
                                value={formik.values.item_unit}
                                onChange={formik.handleChange}                                
                            >
                            </TextField>
                        </Grid>
                        <Grid item sm={6} lg={4} xl={4}>
                            <NumberFormat
                                customInput={TextField}                             
                                fullWidth
                                error={ formik.errors.item_qty }
                                label="Item Quantity"
                                name="item_qty"
                                placeholder="QTY"
                                value={ formik.errors.item_qty ? "" : formik.values.item_qty}
                                helperText={ formik.errors.item_qty ? "Accepts only Number" : "" }
                                onChange={formik.handleChange}
                            />
                        </Grid>                        
                        <Grid item sm={12} lg={12} xl={12}>
                            <TextareaAutosize className={classes.textarea}
                                placeholder="Description"
                                minRows={8}              
                                name="item_desc"
                                variant="outlined"
                                aria-label="maximum height"
                                value={formik.values.item_desc}
                                onChange={formik.handleChange}
                                style={{padding: "10px", outline : "none"}}
                            >
                            </TextareaAutosize>
                        </Grid>                        
                    </Grid><br />
                    <Button
                        type="submit"
                        style={{padding : "5px 60px"}} 
                        size="large" 
                        variant="contained" 
                        color="primary" 
                    >Save</Button>
                </form>                
            </Box>          
        </Grid>
    )
}

export default withStyles(useStyles)(AddProd);
