import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { Modal,Backdrop,Fade, Grid, TextField, MenuItem, Button } from '@material-ui/core';
import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom';
import useStyles from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { generateReport } from '../../store/ReportServices';
import ReportTransactionDocDef from '../docs/ReportTransactionDocDef';
import Loader from '../../../shared/Loader';
import { OpenNotification } from '../../../shared/store/NotificationSlice';
import { setDate } from '../../store/ReportSlice';

const DatePicker = ({report})=>{
    const [selectedFromDate, setSelectedFromDate] = React.useState(new Date(Date.now()));
    const [selectedToDate, setSelectedToDate] = React.useState(new Date(Date.now()));
    const [filterPayment,setFilterPayment] = useState('all');

    const handleFromDateChange = (date) => {
        setSelectedFromDate(date);
    };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
    };

    const handleFilterChange = (e)=>{
        setFilterPayment(e.target.value);
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={2}>            
            <Grid item lg={12} sm={12}>
                <TextField
                    margin="dense"
                    size="small"
                    fullWidth
                    select
                    variant="outlined"
                    label="Filter"
                    value={filterPayment}
                    autoFocus={false}
                    onChange={(e)=>{
                        handleFilterChange(e);
                    }}
                >
                    <MenuItem key={0} value="all">All</MenuItem>
                    <MenuItem
                        key={1} 
                        value="full"
                    >Full Payments</MenuItem>
                    <MenuItem key={2} value="partial">Partial Payments</MenuItem>                    
                </TextField>
            </Grid>
            <Grid item lg={6} sm={6}>
                <KeyboardDatePicker
                margin="dense"
                size="small"
                id="date-picker-dialog"
                label="From Date"
                format="yyyy-MM-dd"
                value={selectedFromDate}
                onChange={handleFromDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',     
                }}
                />
            </Grid>
            <Grid item lg={6} sm={6}>
                <KeyboardDatePicker
                    size="small"                    
                    margin="dense"
                    id="date-picker-dialog"
                    label="To Date"
                    format="yyyy-MM-dd"
                    value={selectedToDate}
                    onChange={handleToDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',      
                    }}
                />
            </Grid>
            <Grid item lg={12} sm={12}>
                <Button                                
                    size="medium"
                    variant="contained"    
                    fullWidth            
                    startIcon={<FontAwesomeIcon icon={faSearch} />}
                    style={{
                        color : "white",
                        borderColor : "white",
                        backgroundColor : "orange"            
                    }}
                    onClick={()=>{          
                        report({
                            from : selectedFromDate.toISOString().split('T')[0],
                            to : selectedToDate.toISOString().split('T')[0],
                            payment_type : filterPayment
                        });
                    }}
                >Generate Report</Button>    
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
    );
}

function TransactionsFilterModal(props) {

    const classes = useStyles();

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url,setUrl] = useState('');
    const { loading } = useSelector(state=>state.report);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);        
    }

    const requestReport = (args)=>{

        const { from,to,payment_type } = args;
        const uri = payment_type !== 'all' ? `/transactions?payment_type=${payment_type}&from=${from}&to=${to}` : `/transactions?from=${from}&to=${to}`;
        dispatch( setDate(uri) );
        handleClose();
    }

    useEffect(()=>{
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}            
            closeAfterTransition
            className={classes.TransactionModal}
        >
            <Fade
                in={open}
            >
                <div className={classes.paper}>
                    <DatePicker report={requestReport} />
                </div>
            </Fade>
        </Modal>
    )
}

export default TransactionsFilterModal
