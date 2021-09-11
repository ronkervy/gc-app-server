import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, withStyles } from '@material-ui/core';
import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllSuppliers
} from '../store/SupplierServices';
import SuppTableItems from './SuppTableItems';
import Styles from './Styles';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router';
import Loader from '../../shared/Loader';

function SuppliersList(props) {
    
    const { classes } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { entities : contacts,loading : suppLoading } = useSelector(state=>state.suppliers);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };    

    useEffect(()=>{
        dispatch( getAllSuppliers({
            opt : {
                url : '/suppliers'
            }
        }));
    },[]);

    if( suppLoading ){
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
            <Grid 
                item 
                lg={12} 
                sm={12}
            >
                <TableContainer elevation={3} component={Paper} className={classes.Table} >
                    <Table stickyHeader aria-label="sticky table" size="small"  >
                        <TableHead>
                            <TableRow>
                                <TableCell>#ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <SuppTableItems rowsPerPage={rowsPerPage} page={page} items={contacts} />
                            <TableRow style={{ position : "absolute", bottom : 0 }}>
                                <TablePagination 
                                    rowsPerPageOptions={[6, 12, 120]}
                                    count={contacts.length}
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
            <Grid 
                component={motion.div}
                item lg={12} 
                sm={12}
                style={{
                    right : "10px",
                    bottom : "10px",
                    position : "absolute"
                }}        
                initial={{
                    opacity : 0,
                    scale : .2
                }}    
                animate={{
                    opacity : 1,
                    scale : 1
                }}
                transition={{
                    duration : .5,
                    delay : .5
                }}
            >
                <Fab
                    size="small"
                    color="primary"
                    onClick={()=>{
                        return history.push('/suppliers/add');
                    }}                
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Fab>
            </Grid>
        </Grid>
    )
}

export default withStyles(Styles)(SuppliersList)
