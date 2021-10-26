import { 
    AppBar, 
    Dialog,
    Grid, 
    IconButton, 
    Paper, 
    Slide, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Toolbar,
    TablePagination,
    makeStyles
} from '@material-ui/core'
import { ArrowBack, Close } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { findTransaction, getAllTransaction } from '../store/TransactionServices';
import TransactionItems from './TransactionItems';

const TransComp = forwardRef((props,ref)=>{
    return <Slide direction="down" {...props} ref={ref} />
});

const useStyles = makeStyles((theme)=>({
    TransDialog : {
        padding : "30px",
        height : "100%"
    },
    TransDialogContent : {
        height : "auto",
    },
    TransTable : {
        minHeight : "580px",
        position : "relative"
    }
}));

function TransactionList(props) {

    const { search,mode } = props;
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    
    const { loading, entities : transactions } = useSelector(state=>state.transactions);
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const { TransTable,TransDialog,TransDialogContent } = useStyles();
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }
    
    useEffect(()=>{

        if( mode === 'search' ){
            console.log(search);
            dispatch( findTransaction({
                opt : {
                    url : `/search/transactions?s=${search}`
                }
            }) );
        }else{
            dispatch( getAllTransaction({
                opt : {
                    url : '/transactions'
                }
            }) );            
        }
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={TransComp}
            className={TransDialog}
            TransitionProps={{
                timeout : 500
            }}
        >
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Grid container spacing={2}>
                        <Grid item lg={2} xl={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
                            <IconButton
                                disableRipple={true}
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <ArrowBack />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} xl={10} sm={10}>                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container className={TransDialogContent}>
                <Grid item lg={12} xl={12} sm={12} style={{ padding : "30px"}}>
                    <TableContainer component={Paper} elevation={3} className={TransTable} >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ textAlign : "left" }}>Customer Name</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Transaction Date</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Payment Type</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Cash Amount</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Total</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Total SRP</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((transaction,i)=>(
                                    <TransactionItems data={transaction} key={i} />
                                ))}
                                <TableRow style={{ position : "absolute", bottom : 0 }}>
                                    <TablePagination
                                        rowsPerPageOptions={[8]}
                                        count={transactions.length}
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
        </Dialog>
    )
}

export default TransactionList
