import React,{ useEffect,useState } from 'react';
import { motion } from 'framer-motion';
import {
  withStyles,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  MenuItem,
  TextField
} from '@material-ui/core';
import Styles from '../Styles';
import ListItems from './ListItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faMoneyBill,
    faWrench
} from '@fortawesome/free-solid-svg-icons';

import { findProduct, getProducts } from '../../store/ProdServices';

import { useSelector,useDispatch } from 'react-redux';
import Loader from '../../../shared/Loader';
import { getAllSuppliers } from '../../../suppliers/store/SupplierServices';
import { useHistory } from 'react-router-dom';

function ListProd(props) {

  const { classes,mode,search } = props;
  const { entities : products,loading : prodLoading } = useSelector(state=>state.products);
  const { entities : suppliers, loading : suppLoading } = useSelector(state=>state.suppliers);
  const history = useHistory();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [filter,setFilter] = useState({
      lowCount : false,
      supplier : 'clear',
      type : 'clear'
  });


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(()=>{
      if( mode === 'search'){
        setPage(0);
        dispatch( findProduct({
          opt : {
            url : '/search/products?query=' + search
          }
        }) );
        return;
      }

      if(!mode){
        dispatch(getProducts('/products'));
      }

      dispatch( getAllSuppliers({
        opt : {
            url : '/suppliers'
        }
      }) );
      
  },[mode]);

  const handleFilterLow = (e)=>{
      setFilter(state=>{
          return {
            ...state,
            lowCount : !state.lowCount
          }
      });
  }

  const handleFilterSupp = (e)=>{
      setFilter(state=>{
          return {
              ...state,
              supplier : e.target.value
          }
      });
  }

  const handleFilterType = (e)=>{
      setFilter(state=>{
        return {
          ...state,
          type : e.target.value
        }
      });
  }

  const typeList = ()=>{
      if( products === undefined) return;
      const productsTypeArr = [...new Set(products.map(product=>product.item_type))]
      return productsTypeArr;
  }

  if( prodLoading || suppLoading ){
     return(
        <Loader />
     )
  }
  
  return (
    <Grid
      component={motion.div}
      container
      initial={{x : -10, opacity : 0}}
      animate={{x: 0, opacity : 1}}
      transition={{duration : .5}}
      style={ mode === "search" ? {
        padding : "20px"
      } : {} }      
    >
        <Grid container spacing={2} component={Paper} style={{ margin : "5px 0px" }}>
          <Grid item lg={4} xl={4} sm={4} style={{ marginTop : "10px" }}>
            <TextField
                fullWidth
                select
                size="small"
                variant="outlined"
                label="Filter Low"
                value={filter.lowCount}
                onChange={handleFilterLow}
            >
                <MenuItem value={false}>No Filter</MenuItem>
                <MenuItem value={true}>Low Count</MenuItem>
            </TextField>
          </Grid>
          <Grid item lg={4} xl={4} sm={4} style={{ marginTop : "10px" }}>
            <TextField
                fullWidth
                select
                size="small"
                variant="outlined"
                label="Filter Type"
                value={filter.type}
                onChange={handleFilterType}
            >
                <MenuItem value='clear'>No Filter</MenuItem>
                {typeList().map((type,i)=>(
                    <MenuItem key={i} value={type}>{type}</MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item lg={4} xl={4} sm={4} style={{ marginTop : "10px" }}>
            <TextField
                fullWidth
                select
                size="small"
                variant="outlined"
                label="Suppliers"
                value={filter.supplier}
                onChange={handleFilterSupp}
            >
                <MenuItem value="clear">No Filter</MenuItem>
                {suppliers.map((supp,i)=>(
                    <MenuItem key={i} value={supp._id}>{supp.supplier_name}</MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>        
        <Grid item lg={12} xl={12} sm={12}>
          <TableContainer component={Paper} elevation={3}  className={classes.Table}>
              <Table size="medium" stickyHeader aria-label="sticky table" >
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>QTY</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell style={{ textAlign : "center" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>   
                <TableBody>
                    {products
                      .filter(product=>filter.lowCount !== false ? product.item_qty <= 8 : product)
                      .filter(product=>filter.type !== 'clear' ? product.item_type === filter.type : product)
                      .filter(product=> filter.supplier !== 'clear' ? product.suppliers.indexOf(filter.supplier) !== -1 : product)
                      .slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage)
                      .map((item,index)=>(                    
                          <TableRow 
                              title={`Name : ${item.item_name}\nDescription : ${item.item_desc}\nBrand : ${item.item_brand}\nType : ${item.item_type}\nUnit : ${item.item_unit}`}
                              style={{cursor : "pointer"}} 
                              onDoubleClick={(e)=>{
                                  history.push('/products/' + item._id);
                              }}  
                              key={index} 
                              tabIndex={-1} 
                              hover
                          >
                              <ListItems item={item} />                       
                          </TableRow>
                      ))}                  
                    <TableRow style={{ position : "absolute", bottom : 0 }}>                    
                      <TablePagination
                          rowsPerPageOptions={[6]}
                          count={products.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                      />                    
                    </TableRow>                  
                </TableBody>           
              </Table>
          </TableContainer>
        </Grid>               
    </Grid>
  )
}

export default withStyles(Styles)(ListProd)
