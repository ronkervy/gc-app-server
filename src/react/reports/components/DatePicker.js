import React, { forwardRef, useEffect, useState } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {  Button,TextField, MenuItem,Grid } from '@material-ui/core';

const DatePicker = ({report})=>{
    const [selectedFromDate, setSelectedFromDate] = React.useState(new Date(Date.now()));
    const [selectedToDate, setSelectedToDate] = React.useState(new Date(Date.now()));
    const [filterModel,setFilterModel] = useState('deliveries');

    const handleFromDateChange = (date) => {
        setSelectedFromDate(date);
    };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
    };

    const handleFilterChange = (e)=>{
        setFilterModel(e.target.value);
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
                    value={filterModel}
                    autoFocus={false}
                    onChange={(e)=>{
                        handleFilterChange(e);
                    }}
                >
                    <MenuItem
                        key={1} 
                        value="deliveries"
                    >Deliveries</MenuItem>
                    <MenuItem key={2} value="transactions">Transactions</MenuItem>
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
                    style : {color : "#ffffff",borderBottomColor : "white"}       
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
                        style : {color : "#ffffff"}       
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
                            model : filterModel
                        });
                    }}
                >Generate Report</Button>    
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
    );
}

export default DatePicker;