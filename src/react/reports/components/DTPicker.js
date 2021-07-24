import React,{useState} from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Grid, TextField, MenuItem, Button } from '@material-ui/core';

const TransactFilter = ({setFn})=>{

    const [filterPayment,setFilterPayment] = useState('all');

    const handleFilterChange = (e)=>{
        setFn(e.target.value)
        setFilterPayment(e.target.value);
    }

    return(
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
    )
}

const DeliveriesFilter = ({setFn})=>{

    const [status,setStatus] = useState('all');

    const handleFilterChange = (e)=>{
        setFn(e.target.value);
        setStatus(e.target.value);
    }

    return(
        <Grid item lg={12} sm={12}>
            <TextField
                margin="dense"
                size="small"
                fullWidth
                select
                variant="outlined"
                label="Filter"
                value={status}
                autoFocus={false}
                onChange={(e)=>{
                    handleFilterChange(e);
                }}
            >
                <MenuItem key={0} value="all">All</MenuItem>
                <MenuItem
                    key={1} 
                    value={'delivered'}
                >Delivered</MenuItem>
                <MenuItem key={2} value={'not delivered'}>Not Delivered</MenuItem>                    
            </TextField>
        </Grid>
    )
}

const DTPicker = ({fn,model})=>{
    const [selectedFromDate, setSelectedFromDate] = React.useState(new Date(Date.now()));
    const [selectedToDate, setSelectedToDate] = React.useState(new Date(Date.now()));
    const [status,setStatus] = useState('all');
    const [filterPayment,setFilterPayment] = useState('all');

    const handleFromDateChange = (date) => {
        setSelectedFromDate(date);
    };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={2}>    
            { model === 'transactions' ? <TransactFilter setFn={setFilterPayment} /> : <DeliveriesFilter setFn={setStatus} /> }        
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
                        fn({
                            from : selectedFromDate.toISOString().split('T')[0],
                            to : selectedToDate.toISOString().split('T')[0],
                            filter : model === 'transactions' ? filterPayment : status
                        });
                    }}
                >Generate Report</Button>    
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
    );
}

export default DTPicker;