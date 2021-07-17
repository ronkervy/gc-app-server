import React, { forwardRef, useEffect, useState } from 'react';
import { Dialog,Slide,AppBar,Toolbar, Grid, IconButton, ButtonGroup, Button} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from '../store/ReportServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import Loader from '../../shared/Loader';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import ReportDocDefDel from './docs/ReportDeliveriesDocDef';
import ReportTransactionDocDef from './docs/ReportTransactionDocDef';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faParagraph, faTruckLoading } from '@fortawesome/free-solid-svg-icons';

const TransitionPage = forwardRef((props,ref)=>{
    console.log(props);
    return <Slide direction="up" ref={ref} {...props} />
});

function Reports(props) {

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url,setUrl] = useState('');
    const { loading } = useSelector( state=>state.report );

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

            const { doc,logo } = resReport.payload;
            let pdf = JSON.parse(doc);
            
            if( pdf.length > 0 ){
                pdfMake.vfs = pdfFonts.pdfMake.vfs;
                
                const docDef = model === 'transactions' ? ReportTransactionDocDef(pdf,logo) : ReportDocDefDel(pdf,logo);
                const docGenerator = pdfMake.createPdf(docDef);
    
                docGenerator.getBlob(blob=>{
                    setUrl(window.URL.createObjectURL(blob));
                });
            }else{
                dispatch( OpenNotification({
                    message : 'No Entry on Current Date.',
                    severity : 'success'
                }));
            }

        }else{
            dispatch( OpenNotification({
                message : 'Error generating report.',
                severity : 'error'
            }));
        }
        return resReport;
    }

    useEffect(()=>{

        const reportDefault = async (args)=>{

            let defaultDate = new Date(Date.now()).toISOString().split('T')[0];
            let defaultToDate = new Date( Date.now() );

            const resReport = await dispatch(generateReport({
                url : `/transactions?from=${'2021-06-01'}&to=${'2021-06-17'}`
            }));
    
            if( generateReport.fulfilled.match(resReport) ){                
    
                const { doc,logo } = resReport.payload;
                let pdf = JSON.parse(doc);
                
                if( pdf.length > 0 ){
                    pdfMake.vfs = pdfFonts.pdfMake.vfs;
                    
                    const docDef = ReportTransactionDocDef(pdf,logo);
                    const docGenerator = pdfMake.createPdf(docDef);
        
                    docGenerator.getBlob(blob=>{
                        setUrl(window.URL.createObjectURL(blob));
                    });
                }else{
                    dispatch( OpenNotification({
                        message : 'No entry on transactions on current date.',
                        severity : 'success'
                    }));
                }
    
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
                <Toolbar variant="dense" style={{ justifyContent : "space-between" }}>
                    <IconButton
                        size="small"
                        onClick={handleClose}
                        color="inherit"
                    >
                        <Close />
                    </IconButton>
                    <ButtonGroup
                        variant="contained"
                        color="primary"
                        style={{
                            justifySelf : "flex-end"
                        }}
                    >
                        <Button
                            startIcon={<FontAwesomeIcon icon={faBoxOpen} />}
                            style={{
                                background : "orange"
                            }}   
                        >
                            Products
                        </Button>
                        <Button
                            startIcon={<FontAwesomeIcon icon={faParagraph} />}
                            style={{
                                background : "orange"
                            }}
                            onClick={()=>{
                                history.push('/report/transactions');
                            }}
                        >
                            Transactions
                        </Button>
                        <Button
                            startIcon={<FontAwesomeIcon icon={faTruckLoading} />}
                            style={{
                                background : "orange",
                            }}
                        >
                            Deliveries
                        </Button>
                    </ButtonGroup>                  
                </Toolbar>
            </AppBar>
            <Grid container style={{ padding: "20px", height : "100%" }}>
                <iframe
                    title="Report"
                    src={url}
                    style={{ border : "none", display:"block", marginTop : "50px", height : "100% !important", width : "100%" }}
                ></iframe>
            </Grid>
        </Dialog>
    )
}

export default Reports
