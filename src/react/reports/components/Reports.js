import React, { forwardRef, useEffect, useState } from 'react';
import { Dialog,Slide,AppBar,Toolbar, Grid, IconButton, ButtonGroup, Button} from '@material-ui/core';
import { ArrowBack, Close } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from '../store/ReportServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import Loader from '../../shared/Loader';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import ReportDeliveriesDocDef from './docs/ReportDeliveriesDocDef';
import ReportTransactionDocDef from './docs/ReportTransactionDocDef';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faReceipt, faTruckLoading } from '@fortawesome/free-solid-svg-icons';
import { clearUri, setModel } from '../store/ReportSlice';
import docImage from 'Public/img/logo.png';

const TransitionPage = forwardRef((props,ref)=>{
    return <Slide direction="up" ref={ref} {...props} />
});

function Reports(props) {

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url,setUrl] = useState('');
    const { loading, uri, model,error } = useSelector( state=>state.report );

    const handleClose = ()=>{  
        dispatch( clearUri() );    
        history.goBack();
        setOpen(false);        
    }

    const reportDefault = async (args)=>{
        
        const resReport = await dispatch(generateReport({
            url : uri !== '' ? uri : `/transactions?from=${'2021-06-01'}&to=${'2021-06-17'}`
        }));

        if( generateReport.fulfilled.match(resReport) ){                

            const { doc,logo,prods } = resReport.payload;

            let pdf = JSON.parse(doc);
            let prodParse = model === 'deliveries' && prods !== undefined ? JSON.parse(prods) : [];

            if( pdf.length > 0 ){
                pdfMake.vfs = pdfFonts.pdfMake.vfs;


                
                const docDef = model === 'deliveries' && uri !== '' ? ReportDeliveriesDocDef(pdf,logo,prodParse) : ReportTransactionDocDef(pdf,logo);
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
                message : 'Error generating report. : ' + error.message,
                severity : 'error'
            }));
        }
    }

    useEffect(()=>{       
        reportDefault();
        dispatch( setModel('deliveries') );
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
            style={{
                padding : "30px"
            }}
            TransitionProps={{
                timeout : 500
            }}
        >
            <AppBar position="relative" style={{ WebkitAppRegion : "no-drag" }}>
                <Toolbar variant="dense" style={{ justifyContent : "space-between" }}>
                    <IconButton
                        size="medium"
                        onClick={handleClose}
                        color="inherit"
                    >
                        <ArrowBack />
                    </IconButton>
                    <ButtonGroup
                        variant="contained"                        
                        color="primary"
                        style={{
                            justifySelf : "flex-end"
                        }}
                    >
                        <Button
                            startIcon={<FontAwesomeIcon icon={faReceipt} />}
                            style={{
                                backgroundColor : "orange"
                            }}
                            onClick={()=>{
                                dispatch( clearUri() );
                                history.push('/report/transactions');
                            }}
                        >
                            Transactions
                        </Button>
                        <Button
                            startIcon={<FontAwesomeIcon icon={faTruckLoading} />}
                            color="secondary"
                            onClick={()=>{
                                dispatch( clearUri() );
                                history.push('/report/deliveries');
                            }}
                        >
                            Deliveries
                        </Button>
                    </ButtonGroup>                  
                </Toolbar>
            </AppBar>
            <Grid 
                container
                style={ uri !== '' ? { 
                    padding: "20px", 
                    height : "100%", 
                    marginTop : "0px",
                    backgroundColor : "gainsboro"
                } : {
                    height : "100%", 
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center",
                } }
            >
                {uri !== '' ? (
                    <iframe
                        title="Report"
                        src={url}
                        style={{ border : "none", display:"block", height : "100% !important", width : "100%" }}
                    ></iframe>
                ) : (
                    <div>
                        <img
                            src={docImage} alt="doc-img" 
                            style={{
                                opacity : .2
                            }}
                        />
                        <h3 style={{ marginTop : "5px", textAlign : "center", opacity : .2 }}>No report loaded</h3>
                    </div>
                )}
                
            </Grid>
        </Dialog>
    )
}

export default Reports
