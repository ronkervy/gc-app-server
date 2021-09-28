import { faBoxOpen, faPlusCircle, faSearch, faShoppingCart, faRecycle,faTrashAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';
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
import { Refresh } from '@material-ui/icons';
import { getProducts } from '../../products/store/ProdServices';


function SearchTable(props) {
    
    const [search, setSearch] = useState('');
    const { address,soldTo } = props.infoField;
    const dispatch = useDispatch();
    const [supp,setSupp] = useState({});
    const { entities : products, loading : prodLoading } = useSelector( state=>state.products );
    const { cart } = useSelector( state=>state.deliveries );
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [cartPage, setCartPage] = useState(0);
    const [cartRowsPerPage, setCartRowsPerPage] = useState(4);
    const [filter,setFilter] = useState({
        supplier : 'clear'
    });
  
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

    const filterSupplier = (e)=>{
        setFilter(state=>{
            return {
                ...state,
                supplier : e.target.value
            }
        });
    }

    useEffect(()=>{
        if( search !== '' ){
            dispatch( findProduct({
                opt : {
                    url : '/search/products?query=' + search
                }
            }) );
        }
    },[search]);

    useEffect(()=>{
        dispatch( getProducts('/products') );
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
        return ()=>{
            setSupp({});
        }
    },[]);

    if( prodLoading ){
        return(
            <Loader />
        )
    }

    return (
        <Grid container spacing={2}>  
            <Grid container spacing={2} component={Paper} style={{ padding : "5px", margin : "10px" }}>
                <Grid 
                    item 
                    lg={6} 
                    xl={6} 
                    sm={6}
                    style={{
                        display : "flex",
                        alignItems : "center",
                        justifyContent : "center"
                    }}
                >
                    <FormControl
                        fullWidth                    
                        size="small"
                    >
                        <TextField 
                            size="small"
                            variant="outlined"
                            placeholder="Search"
                            InputProps={{
                                startAdornment : (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputAdornment>
                                )
                            }}
                            onKeyPress={(e)=>{
                                if( e.key === 'Enter' ){
                                    setSearch(e.target.value)
                                }                            
                            }}
                        />                      
                    </FormControl>                              
                </Grid>                          
                <Grid 
                    item 
                    lg={4} 
                    xl={4} 
                    sm={4}
                    style={{
                        display : "flex",
                        alignItems : "center",
                        justifyContent : "center"
                    }}
                >
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <TextField
                            select
                            label="Supplier"
                            size="small"
                            variant="outlined"
                            placeholder="Supplier"
                            value={filter.supplier}
                            InputProps={{
                                startAdornment : (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faUserTie} />
                                    </InputAdornment>
                                )
                            }}
                            onChange={filterSupplier}
                        >
                            <MenuItem value="clear">No Filter</MenuItem>
                            {supp.length > 0 ? supp.map((contact,i)=>(
                                <MenuItem key={i} value={contact._id}>{contact.supplier_name}</MenuItem>
                            )) : (
                                <MenuItem>Please create a supplier first.</MenuItem>
                            )}
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid item lg={2} xl={2} sm={2} style={{
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center"
                }}>
                    <Button
                        style={{
                            background : "green",
                            color : "white"
                        }}
                        variant="contained"
                        size="medium"
                        startIcon={<Refresh />}
                        onClick={async ()=>{
                            await dispatch( getProducts("/products") );
                        }}
                    >Refresh</Button>
                </Grid>              
            </Grid>                
            <Grid item lg={6} xl={6} sm={6}>                    
                    <TableContainer elevation={3} component={Paper} style={{ height : "auto", minHeight : "390px", position : "relative" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Price</TableCell>
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
                                {(filter.supplier != 'clear' ? products.filter(product=>product.suppliers.indexOf(filter.supplier) !== -1) : products).slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((product,index)=>(
                                    <TableRow 
                                        title={`Name : ${product.item_name}`}
                                        key={index}
                                    >
                                        <TableCell>{product.item_name.substring(0,18) + "..."}</TableCell>
                                        <TableCell>
                                            <NumberFormat 
                                                customInput={TextField}
                                                margin="dense"
                                                displayType="text"
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
                                                    dispatch( AddToCart({
                                                        ...product,
                                                        address,
                                                        soldTo
                                                    }) );
                                                }}
                                            >Add</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow style={{ position : "absolute", bottom : 0, left : 0 }} >
                                    <TablePagination
                                        rowsPerPageOptions={[5]}
                                        count={products.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={false}
                                    />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>                
                <Grid item lg={6} xl={6} sm={6}>
                    <TableContainer elevation={3} component={Paper}  style={{minHeight : "390px", position : "relative"}}>
                        <Table size="small">
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
                                            <IconButton                                                      
                                                size="small"
                                                onClick={()=>{
                                                    dispatch( RemoveFromCart(product) );
                                                }}
                                            >
                                                <FontAwesomeIcon color="red" icon={faTrashAlt} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} style={{textAlign : "center"}}>
                                            <Typography 
                                                variant="h6"
                                            >
                                                <FontAwesomeIcon color="primary" icon={faShoppingCart} />&nbsp;&nbsp;
                                                 Cart Empty
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                                <TableRow style={{ bottom : 0, left: 0, position : "absolute" }}>
                                    <TablePagination
                                        rowsPerPageOptions={[4]}
                                        count={cart.length}
                                        rowsPerPage={cartRowsPerPage}
                                        page={cartPage}
                                        onPageChange={handleChangeCartPage}
                                        onRowsPerPageChange={handleChangeCartRowsPerPage}
                                        labelRowsPerPage={false}
                                    />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
        </Grid>
    )
}

export default withStyles(Styles)(SearchTable)
