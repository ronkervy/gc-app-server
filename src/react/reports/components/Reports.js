import 'date-fns';
import React, { forwardRef, useEffect, useState } from 'react';
import { Dialog,Slide,AppBar,Toolbar, Grid, IconButton, Button,TextField, MenuItem } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from '../store/ReportServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import Loader from '../../shared/Loader';

const TransitionPage = forwardRef((props,ref)=>{
    return <Slide direction="up" ref={ref} {...props} />
});

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
          <Grid style={{color : "#ffffff",alignItems : "center",justifyContent : "flex-end"}} container>            
            <TextField
                margin="dense"
                size="small"
                select
                variant="outlined"
                label="Filter"
                value={filterModel}
                autoFocus={false}
                onChange={(e)=>{
                    handleFilterChange(e);
                }}
                style={{
                    borderRadius : '5px',
                    color : "white"                    
                }}
                InputLabelProps={{
                    style : {
                        color : "white"                         
                    }
                }}
                inputProps={{
                    style : {
                        color : "white"                        
                    }
                }}
                SelectProps={{
                    style : {
                        color : "#ced4da",
                        outline : "none"
                    }
                }}
            >
                <MenuItem
                    key={1} 
                    value="deliveries"

                >Deliveries</MenuItem>
                <MenuItem key={2} value="transactions">Transactions</MenuItem>
            </TextField>&nbsp;&nbsp;&nbsp;&nbsp;
            <KeyboardDatePicker
              margin="dense"
              size="small"
              id="date-picker-dialog"
              label="From Date"
              format="yyyy-MM-dd"
              value={selectedFromDate}
              inputProps={{
                  style : {
                      color : "#ffffff",
                      borderBottomColor : "white"
                  }
              }}
              InputLabelProps={{
                  style : {
                      color : "white"
                  }                  
              }}
              onChange={handleFromDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
                style : {color : "#ffffff",borderBottomColor : "white"}       
              }}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <KeyboardDatePicker
              size="small"
              margin="dense"
              id="date-picker-dialog"
              label="To Date"
              format="yyyy-MM-dd"
              value={selectedToDate}
              style={{
                  borderBottomColor : "#ffffff"
              }}
              inputProps={{
                  style : {
                      color : "#ffffff"
                  }
              }}
              InputLabelProps={{
                  style : {
                      color : "white"
                  }
              }}
              onChange={handleToDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
                style : {color : "#ffffff"}       
              }}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <Button                                
                size="medium"
                variant="contained"                
                startIcon={<FontAwesomeIcon icon={faSearch} />}
                style={{
                    color : "white",
                    borderColor : "white",
                    backgroundColor : "orange"            
                }}
                onClick={()=>{
                    console.log(selectedFromDate.toISOString().split('T')[0],selectedToDate.toISOString().split('T')[0]);
                    report({
                        from : selectedFromDate.toISOString().split('T')[0],
                        to : selectedToDate.toISOString().split('T')[0],
                        model : filterModel
                    });
                }}
            >Generate Report</Button>
          </Grid>
        </MuiPickersUtilsProvider>
    );
}

function Reports() {

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { entities : report, loading } = useSelector( state=>state.report );

    const handleClose = ()=>{        
        history.goBack();
        setOpen(false);        
    }

    const requestReport = async (args)=>{

        const { from,to,model } = args;
        const resReport = await dispatch(generateReport({
            url : `/${model}?from=${from}&to=${to}`
        }));

        if( generateReport.fulfilled.match(resReport) ){
            console.log(resReport.payload);
        }else{
            dispatch( OpenNotification({
                message : 'Error generating report.',
                severity : 'error'
            }));
        }
        return resReport;
    }

    useEffect(()=>{
        const defaultDate = new Date(Date.now());

        const reportDefault = async ()=>{
            const resReport = await dispatch(generateReport({
                url : `/transactions?from=2021-06-01&to=2021-06-20`
            }));

            if( generateReport.fulfilled.match(resReport) ){
                console.log(resReport.payload);
            }else{
                dispatch( OpenNotification({
                    message : 'Error generating report.',
                    severity : 'error'
                }));
            }
            return resReport;
        }

        reportDefault();

        setOpen(true);
    },[]);


    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={TransitionPage}
            fullScreen
        >
            <AppBar style={{ WebkitAppRegion : "no-drag" }}>
                <Toolbar variant="dense">
                    <IconButton
                        size="small"
                        onClick={handleClose}
                        color="inherit"
                    >
                        <Close />
                    </IconButton>
                    <DatePicker report={requestReport} />
                </Toolbar>
            </AppBar>
            <Grid container style={{ padding: "20px" }}>
                <iframe
                    title="Report"
                    src={``}
                    style={{ margin : "50px 0px", height : "100%", width : "100%" }}
                ></iframe>
            </Grid>
        </Dialog>
    )
}

export default Reports
