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
    makeStyles,
    Button,
    MenuItem,
    TextField
} from '@material-ui/core'
import { ArrowBack, Close } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { findTransaction, getAllTransaction } from '../store/TransactionServices';
import TransactionItems from './TransactionItems';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import moment from 'moment';

const TransComp = forwardRef((props,ref)=>{
    return <Slide direction="down" {...props} ref={ref} />
});

const useStyles = makeStyles((theme)=>({
    TransDialog : {
        padding : "30px 30px 30px 30px",
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

function FilterDate(props){

    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid 
                container 
                style={{ 
                    paddingLeft : "30px", 
                    display : "flex",
                    alignItems : "center",
                    WebkitAppRegion : "no-drag"
                }} 
            >
                <Grid
                    item
                    lg={3}
                    sm={3}
                >
                    <KeyboardDatePicker 
                        fullWidth
                        disableToolbar
                        variant="dialog"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date Filter"
                        KeyboardButtonProps={{
                        'aria-label': 'change date',
                        }}
                        InputLabelProps={{
                            shrink : true
                        }}
                        size="small"
                        {...props}
                    />
                </Grid>
                {props.children}                
            </Grid>
        </MuiPickersUtilsProvider>
    )
}

function TransactionList(props) {

    const { search,mode } = props;
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    
    const { loading, entities : transactions } = useSelector(state=>state.transactions);
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const { TransTable,TransDialog,TransDialogContent } = useStyles();
    const [selectedDate,setSelectedDate] = useState(new Date());
    const [filter,setFilter] = useState(false);
    const [paymentType,setPaymentType] = useState('none');

    const handleDateChange = (date)=>{
        let resDate = transactions.filter(transaction=>moment(transaction.transaction_date).format("YYYY-MM-DD") == moment(date).format('YYYY-MM-DD'))
        setFilter(resDate);
        setSelectedDate(moment(date).format("YYYY-MM-DD"));
    }
  
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

    const handlePaymentType = (e)=>{
        setPaymentType(e.target.value);
    }

    const handleBtnClear = ()=>{
        setFilter(false);
        setPaymentType('none');
        dispatch( getAllTransaction({
            opt : {
                url : '/transactions'
            }
        }) );    
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
                <FilterDate 
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    <Grid item lg={3} sm={3} style={{ marginLeft : "30px" }}>
                        <TextField
                            select
                            variant="outlined"
                            size="small"
                            label="Payment Type"
                            value={paymentType}
                            onChange={handlePaymentType}
                            fullWidth
                            style={{ WebkitAppRegion : "no-drag" }}
                        >
                            <MenuItem style={{ WebkitAppRegion : "no-drag" }} key={0} value="none">None</MenuItem>
                            <MenuItem style={{ WebkitAppRegion : "no-drag" }} key={1} value="full">Full</MenuItem>
                            <MenuItem style={{ WebkitAppRegion : "no-drag" }} key={2} value="partial">Partial</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item lg={3} sm={3} style={{ marginLeft : "30px" }}>
                        <Button                        
                            variant="contained"
                            size="medium"
                            color="primary"
                            onClick={handleBtnClear}
                        >Clear</Button>
                    </Grid>                    
                </FilterDate>         
                <Grid item lg={12} xl={12} sm={12} style={{ padding : "10px 30px 30px 30px"}}>
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
                                {(paymentType !== 'none' ? (filter ? filter : transactions).filter(transaction=>transaction.payment_type == paymentType) : (filter ? filter : transactions)).slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((transaction,i)=>(
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
