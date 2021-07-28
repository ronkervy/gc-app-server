import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Fab, 
    Grid,    
    Paper,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow,
    withStyles
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import Styles from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllDeliveries } from '../store/DelServices';
import ListTableRow from './ListTableRow';
import Loader from '../../shared/Loader';

function ListDeliveries(props) {

    const { classes } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { entities : deliveries,loading : deliveriesIsLoading } = useSelector(state=>state.deliveries);

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
        dispatch( GetAllDeliveries({
            opt : {
                url : '/deliveries'
            }
        }) );
    },[]);

    if( deliveriesIsLoading ){
        return(
            <Loader />
        )
    }

    return (
        <Grid 
            container
            transition={{duration : .5}}
            initial={{x : -10,opacity : 0}}
            animate={{x : 0,opacity : 1}}
            component={motion.div}
        >
            <Grid item lg={12} sm={12} style={{
                marginTop : "10px"
            }}>
                <TableContainer component={Paper} elevation={2}>
                    <Table size="small" stickyHeader className={classes.Table}>
                        <TableHead>
                            <TableRow>               
                                <TableCell />                 
                                <TableCell>#ID</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell style={{
                                    textAlign : 'center'
                                }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deliveries.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((delivery,index)=>(
                                <ListTableRow key={index} delivery={delivery} index={index} />
                            ))}                                                       
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[6, 12, 120]}
                                    count={deliveries.length}
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
                item 
                lg={12} 
                sm={12}
                component={motion.div}
                style={{
                    right: 0,
                    bottom : 0,
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
                    color="primary"
                    onClick={()=>{
                        history.push('/deliveries/add');
                    }}
                    size="medium"
                >
                    <FontAwesomeIcon icon={faPlus} />
                </Fab>
            </Grid>
        </Grid>
    )
}

export default withStyles(Styles)(ListDeliveries)
