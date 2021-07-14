import { faBoxOpen, faPlusCircle, faSearch, faShoppingCart, faTrashAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    Grid, 
    InputAdornment, 
    TextField, 
    Box, 
    FormControl, 
    withStyles, 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Paper, 
    Typography,
    Button,
    IconButton,
    MenuItem,
    TablePagination
} from '@material-ui/core';
import React,{useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct } from '../../products/store/ProdServices';
import NumberFormat from 'react-number-format';
import Styles from './Styles';
import { AddToCart, RemoveFromCart,UpdateQty,SetDiscount } from '../store/DeliveriesSlice';
import { motion } from 'framer-motion';
import { getAllSuppliers, getSupplierProducts } from '../../suppliers/store/SupplierServices';
import Loader from '../../shared/Loader';


function SearchTable(props) {
    
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();
    const [supplier,setSupplier] = useState('');
    const [supplierProducts,setSuppliersProducts] = useState({});
    const [supp,setSupp] = useState({});
    const { entities : products, loading : prodLoading } = useSelector( state=>state.products );
    const { cart } = useSelector( state=>state.deliveries );
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [cartPage, setCartPage] = useState(0);
    const [cartRowsPerPage, setCartRowsPerPage] = useState(6);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleChangeCartPage = (event, newPage) => {
      setCartPage(newPage);
    };
  
    const handleChangeCartRowsPerPage = (event) => {
      setCartRowsPerPage(+event.target.value);
      setCartPage(0);
    };

    useEffect(()=>{
        if( supplier !== '' ){
            const resSuppProd = async ()=>{
                const res = await dispatch( getSupplierProducts({
                    opt : {
                        url : '/suppliers/prods/' + supplier
                    },
                    name : search
                }) );

                if( getSupplierProducts.fulfilled.match( res ) ){
                    setSuppliersProducts(res.payload);
                }
            }
            resSuppProd();
        }else{
            dispatch( findProduct({
                opt : {
                    url : '/products/search/' + search
                }
            }) );
        }
    },[search,supplier]);

    useEffect(()=>{
        const getSupp = async ()=>{
            const res = await dispatch( getAllSuppliers({
                opt : {
                    url : '/suppliers'
                }
            }));

            if( getAllSuppliers.fulfilled.match(res) ){
                setSupp(res.payload);
            }
        }
        getSupp();
    },[]);

    if( prodLoading ){
        return(
            <Loader />
        )
    }

    return (
        <Grid container spacing={2} style={{ padding : "0px 20px" }}>            
            <Grid item lg={8} sm={8}>
                <FormControl
                    fullWidth                    
                    size="small"
                    margin="dense"
                >
                    <TextField 
                        margin="dense"
                        variant="outlined"
                        placeholder="Search"
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputAdornment>
                            )
                        }}
                        onChange={(e)=>{
                            setSearch(e.target.value)
                        }}
                    />                      
                </FormControl>                              
            </Grid>
            <Grid item lg={4} sm={4}>
                <FormControl
                    fullWidth
                    size="small"
                    margin="dense"
                >
                    <TextField
                        select
                        margin="dense"
                        variant="outlined"
                        placeholder="Supplier"
                        value={supplier}
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faUserTie} />
                                </InputAdornment>
                            )
                        }}
                        onChange={(e)=>{
                            setSupplier(e.target.value);
                        }}
                    >
                        {supp.length > 0 ? supp.map(contact=>(
                            <MenuItem value={contact._id}>{contact.supplier_name}</MenuItem>
                        )) : (
                            <MenuItem>Please create a supplier first.</MenuItem>
                        )}
                    </TextField>
                </FormControl>
            </Grid>
            <Grid item lg={6} sm={6}>                    
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Product Price</TableCell>
                                    <TableCell style={{textAlign : "center"}}>QTY</TableCell>
                                    <TableCell style={{textAlign : "center"}}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody
                                component={motion.tbody}
                                initial={{
                                    x : -10,
                                    opacity : 0
                                }}
                                animate={{
                                    x : 0,
                                    opacity : 1
                                }}
                                transition={{
                                    duration : .5
                                }}
                            >
                                {(supplier !== '' ? supplierProducts : products).length > 0 ? (supplier !== '' ? supplierProducts : products).slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((product,index)=>(
                                    <TableRow 
                                        key={index}
                                    >
                                        <TableCell>{product.item_name}</TableCell>
                                        <TableCell>
                                            <NumberFormat 
                                                customInput={TextField}
                                                margin="dense"
                                                displayType="text"
                                                prefix="Php "
                                                thousandSeparator={true}
                                                decimalScale={2}
                                                decimalSeparator={'.'}
                                                fixedDecimalScale={true}
                                                value={product.item_price}
                                            />
                                        </TableCell>
                                        <TableCell style={{textAlign : 'center',width : "100px"}}>
                                            {product.item_qty}
                                        </TableCell>
                                        <TableCell style={{ textAlign : "center" }}>
                                            <Button 
                                                size="small" 
                                                variant="outlined" 
                                                color="primary"
                                                startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                                                onClick={(e)=>{                                                    
                                                    dispatch( AddToCart(product) );
                                                }}
                                            >Add</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{ textAlign : "center" }}>
                                            <Typography variant="h6">
                                                <FontAwesomeIcon color="primary" icon={faBoxOpen} />&nbsp;&nbsp;
                                                No Product to display
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <TablePagination
                                            rowsPerPageOptions={[6, 12, 120]}
                                            count={products.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item lg={6} sm={6}>
                    <TableContainer component={Paper}>
                        <Table size="small" style={{height : "min-height : 400px"}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell style={{textAlign : 'center'}}>QTY</TableCell>
                                    <TableCell style={{textAlign : 'center'}}>Discount</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.length > 0 ? cart.slice(cartPage*cartRowsPerPage,cartPage*cartRowsPerPage + cartRowsPerPage).map((product,index)=>(
                                    <TableRow 
                                        key={index}
                                        component={motion.tr}
                                        initial={{                                            
                                            opacity : 0,
                                            y : -20
                                        }}
                                        animate={{
                                            opacity : 1,
                                            y : 0
                                        }}
                                        transition={{
                                            duration : .5
                                        }}
                                    >
                                        <TableCell>{product.item_name}</TableCell>
                                        <TableCell style={{textAlign : 'center',width : "100px"}}>
                                            <NumberFormat
                                                size="small"
                                                variant="outlined"
                                                customInput={TextField} 
                                                decimalScale={0}
                                                fixedDecimalScale={true}  
                                                margin="dense"
                                                style={{fontSize : "10px"}}
                                                value={product.qty} 
                                                onChange={(e)=>{
                                                    dispatch( UpdateQty({
                                                        product,
                                                        qty : e.target.value
                                                    }) )
                                                }}                      
                                            />
                                        </TableCell>
                                        <TableCell style={{textAlign : 'center',width : "100px"}}>
                                            <NumberFormat
                                                size="small"
                                                variant="outlined"
                                                customInput={TextField} 
                                                decimalScale={0}
                                                fixedDecimalScale={true}  
                                                margin="dense"
                                                style={{fontSize : "10px"}}
                                                value={product.item_discount} 
                                                onChange={(e)=>{
                                                    dispatch( SetDiscount({
                                                        product,
                                                        item_discount : e.target.value
                                                    }) )
                                                }}                      
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    color="maroon" 
                                                    size="small"
                                                    onClick={()=>{
                                                        dispatch( RemoveFromCart(product) );
                                                    }}
                                                >
                                                    <FontAwesomeIcon color="red" icon={faTrashAlt} />
                                                </IconButton>
                                            </TableCell>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} style={{textAlign : "center"}}>
                                            <Typography 
                                                variant="h6"
                                            >
                                                <FontAwesomeIcon color="primary" icon={faShoppingCart} />&nbsp;&nbsp;
                                                Cart Empty
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <TablePagination
                                            rowsPerPageOptions={[6, 12, 120]}
                                            count={cart.length}
                                            rowsPerPage={cartRowsPerPage}
                                            page={cartPage}
                                            onPageChange={handleChangeCartPage}
                                            onRowsPerPageChange={handleChangeCartRowsPerPage}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
        </Grid>
    )
}

export default withStyles(Styles)(SearchTable)
