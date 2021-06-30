import React,{ useEffect,useState } from 'react';
import { useFormik } from 'formik';
import useStyles from './Styles';
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
    faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    createProduct,
    updateProduct
} from '../store/ProdServices';
import io from 'socket.io-client';
import NumberFormat from 'react-number-format';
import { getAllSuppliers } from '../../suppliers/store/SupplierServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';


const  AddProd = (props)=> {    

    const { classes,data,mode,supp } = props;
    const dispatch = useDispatch();
    const [updatedProd,setUpdatedProd] = useState();
    const [createdProd,setCreatedProd] = useState();
    const [supplier,setSupplier] = useState('');
    const { entities : suppliers } = useSelector(state=>state.suppliers);

    const handleSuppChange = (e)=>{
        setSupplier(e.target.value);
        formik.handleChange(e);
    }

    useEffect(()=>{
        if( mode !== 'edit' ){
            dispatch( getAllSuppliers({
                opt : {
                    url : '/suppliers'
                }
            }) );
        }
    },[mode]);

    useEffect(()=>{        
        const socket = io("http://localhost:8081");
        socket.emit("created_product",createdProd);
    },[createdProd,mode]);

    useEffect(()=>{
        const socket = io("http://localhost:8081");
        socket.emit("updated_product",updateProduct);
    },[updatedProd,mode]);

    const initialValues = {
        item_code : mode === 'edit' ? data.item_code : '',
        item_name : mode === 'edit' ? data.item_name : '',
        item_desc : mode === 'edit' ? data.item_desc : '',
        item_supplier : mode === 'edit' ? data.item_supplier : supplier,
        item_price : mode === 'edit' ? data.item_price : 0,
        item_selling_price : mode === 'edit' ? data.item_selling_price : 0,
        item_categ : mode === 'edit' ? data.item_categ : '',
        item_qty : mode === 'edit' ? data.item_qty : 0
    }

    const validate = values =>{

        let errors = {};

        if( (/^[a-zA-Z0-9]{0,3}$/i).test(values.item_name) ){
            errors.item_name = true;
        }

        if( (/[a-zA-Z]/i).test(values.item_qty) ){
            errors.item_qty = true;
        }

        if( (/[a-zA-Z]/i).test(values.item_price) ){
            errors.item_price = true;            
        }

        if( (/[a-zA-Z]/i).test(values.item_selling_price) ){
            errors.item_selling_price = true;
        }

        return errors;
    } 

    const formik = useFormik({
        initialValues, 
        onSubmit : async (values,actions) =>{
            if( mode === 'edit' ){
                const product = await dispatch( updateProduct({
                    opt : {
                        url : "/products/" + data.item_id
                    },
                    values
                }));

                if( updateProduct.fulfilled.match(product) ){
                    const editedProd = product.payload;
                    setUpdatedProd(editedProd);        
                    dispatch( OpenNotification({
                        message : "Product has been updated.",
                        severity : "success"
                    }) );                                                                  
                }else{
                    dispatch( OpenNotification({
                        message : "Product has not been updated.",
                        severity : "error"
                    }) );   
                }         
                return;
            }

            console.log("trigger");
            const product = await dispatch( createProduct({
                opt : {
                    url : "/products"
                },
                values
            }) );

            if( createProduct.fulfilled.match(product) ){
                const newProduct = product.payload;
                dispatch( OpenNotification({
                    message : "Product has been saved in the database.",
                    severity : "success"
                }) ); 
                setCreatedProd(newProduct);                
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

    return (
        <Grid 
            className={classes.AppProd}
            container
            component={motion.div}
            initial={{x:-20,opacity : 0}}
            transition={{duration : .4}}
            animate={{x:0,opacity : 1}}            
        >
            <Box lg={12} boxShadow={1} padding={3} style={{backgroundColor : "#FFFFFF"}}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} sm={12}>
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
                        <Grid item lg={6} sm={6} >
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
                        <Grid item lg={6} sm={6}>
                            <FormControl variant="outlined" fullWidth size="small">
                                <TextField
                                    select
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
                                    {(mode === 'edit' ? supp : suppliers).map((contact,index)=>{
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
                        <Grid item sm={6} lg={6}>
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
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <small>Php</small>
                                        </InputAdornment>
                                    )
                                }}                                
                            />
                        </Grid>
                        <Grid item sm={6} lg={6}>
                            <NumberFormat
                                customInput={TextField} 
                                thousandSeparator={true}
                                decimalScale={2}
                                decimalSeparator={'.'}
                                fixedDecimalScale={true}                            
                                fullWidth
                                size="small"
                                error={formik.errors.item_selling_price}
                                helperText={ formik.errors.item_selling_price ? "Accepts only Number" : "" }                            
                                id="item_selling_price"
                                name="item_selling_price"
                                label="Item Selling Price"
                                variant="outlined"
                                value={ formik.errors.item_selling_price ? "" : formik.values.item_selling_price}
                                onChange={formik.handleChange}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <small>Php</small>
                                        </InputAdornment>
                                    )
                                }}
                            />                              
                        </Grid>
                        <Grid item sm={6} lg={8}>
                            <TextField
                                fullWidth
                                label="Item Category"
                                name="item_categ"
                                placeholder="Category"
                                value={formik.values.item_categ}
                                onChange={formik.handleChange}                                
                            >
                            </TextField>
                        </Grid>
                        <Grid item sm={6} lg={4}>
                            <NumberFormat
                                customInput={TextField} 
                                thousandSeparator={true}                                
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
                        <Grid item sm={12} lg={12}>
                            <TextareaAutosize className={classes.textarea}
                                rowsMin={15}              
                                name="item_desc"
                                variant="outlined"
                                aria-label="maximum height"
                                value={formik.values.item_desc}
                                onChange={formik.handleChange}
                                style={{padding: "10px"}}
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
                    >{ props.mode === 'edit' ? 'Update' : 'Save' }</Button>
                </form>                
            </Box>          
        </Grid>
    )
}

export default withStyles(useStyles)(AddProd);
