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
  Paper
} from '@material-ui/core';
import Styles from './Styles';
import ListItems from './ListItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faMoneyBill,
    faMoneyBillAlt,
    faWrench
} from '@fortawesome/free-solid-svg-icons';

import { findProduct, getProducts } from '../store/ProdServices';

import { useSelector,useDispatch } from 'react-redux';
import Loader from '../../shared/Loader';
import { getAllSuppliers } from '../../suppliers/store/SupplierServices';
import { useHistory } from 'react-router-dom';

function ListProd(props) {

  const { classes,mode,search } = props;
  const { entities : products,loading : prodLoading } = useSelector(state=>state.products);
  const { entities : suppliers, loading : suppLoading } = useSelector(state=>state.suppliers);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const history = useHistory();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(()=>{
      if( mode === 'search'){
        dispatch( findProduct({
          opt : {
            url : '/products/search/' + search
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
    >
        <TableContainer component={Paper} elevation={3}  className={classes.Table}>
            <Table size="medium" stickyHeader aria-label="sticky table" >
              <TableHead>
                  <TableRow>
                      <TableCell><FontAwesomeIcon icon={faBox} /> Name</TableCell>
                      <TableCell>QTY</TableCell>
                      <TableCell><FontAwesomeIcon style={{ color : "green" }} icon={faMoneyBill} /> Price</TableCell>
                      <TableCell><FontAwesomeIcon style={{ color : "green" }} icon={faMoneyBillAlt} /> SRP</TableCell>
                      <TableCell style={{ textAlign : "center" }}><FontAwesomeIcon icon={faWrench} /> Actions</TableCell>
                  </TableRow>
              </TableHead>   
              <TableBody>
                  {products.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((item,index)=>(
                    <TableRow 
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
                  <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[6, 12, 120]}
                        count={products.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </TableRow>                  
              </TableBody>           
            </Table>
        </TableContainer>       
    </Grid>
  )
}

export default withStyles(Styles)(ListProd)
