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
import { faBoxOpen, faReceipt, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import { clearDate } from '../store/ReportSlice';

const TransitionPage = forwardRef((props,ref)=>{
    return <Slide direction="up" ref={ref} {...props} />
});

function Reports(props) {

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url,setUrl] = useState('');
    const { loading, uri } = useSelector( state=>state.report );

    const handleClose = ()=>{        
        history.goBack();
        setOpen(false);        
    }

    const reportDefault = async (args)=>{

        const resReport = await dispatch(generateReport({
            url : uri ? uri : `/transactions?from=${'2021-06-01'}&to=${'2021-06-17'}`
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
    }

    useEffect(()=>{       
        console.log(uri);
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
                <Toolbar variant="regular" style={{ justifyContent : "space-between" }}>
                    <IconButton
                        size="medium"
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
                            startIcon={<FontAwesomeIcon icon={faReceipt} />}
                            color="default"
                            onClick={()=>{
                                dispatch( clearDate() );
                                history.push('/report/transactions');
                            }}
                        >
                            Transactions
                        </Button>
                        <Button
                            startIcon={<FontAwesomeIcon icon={faTruckLoading} />}
                            color="secondary"
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
