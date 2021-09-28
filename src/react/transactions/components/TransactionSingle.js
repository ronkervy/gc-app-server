import { faEye, faIdCard, faMoneyBill, faPrint, faSave, faTrash, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    Backdrop, 
    Fade, 
    Grid, 
    Modal, 
    TextField,
    makeStyles,
    InputAdornment,
    ButtonGroup,
    Button,
    TableContainer,
    TableHead,
    TableRow,
    Table,
    TableCell,
    TableBody,
    Typography,
    Paper,
    TablePagination,
} from '@material-ui/core'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { createTransactionReport, deleteTransaction, getSingleTransaction, updateTransaction } from '../store/TransactionServices';
import TransactionDoc from '../docs/TransactionDoc';
import pdfmake from 'pdfmake/build/pdfmake';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import pdfmakeFonts from 'pdfmake/build/vfs_fonts';
import NumberFormat from 'react-number-format';
import { io } from 'socket.io-client';
const useStyles = makeStyles((theme)=>({
    TranSingleModal : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        outline : "none"
    },
    TranSingleModalContent : {
        background : "#ffffff",    
        width : "560px",
        padding : "50px",
        outline : "none"
    }
}));

function TransactionSingle() {
    
    const [open,setOpen] = useState(false);
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { loading,entities : transactions } = useSelector(state=>state.transactions);
    const { settings } = useSelector(state=>state.settings.entities);
    const {TranSingleModal,TranSingleModalContent} = useStyles();
    const [payment,setPayment] = useState({
        partial_payments : 0
    }); 
    const socket = io('http://localhost:8081');
    
    const { ipcRenderer } = window.require('electron');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    const formatter = new Intl.NumberFormat('en-PH',{
        style : 'currency',
        currency : 'Php'
    });

    const handleClose = ()=>{        
        history.goBack();
        setOpen(false);        
    }

    const fetchTransaction = async()=>{
        const res = await dispatch( getSingleTransaction({
            opt : {
                url : `/transactions/${id}`
            }
        }) );

        if( getSingleTransaction.rejected.match(res) ){
            dispatch( OpenNotification({
                message : `Error Loading transactions. : ${res.payload}`,
                severity : "error"
            }) );
        }
    }

    useEffect(()=>{

        fetchTransaction();
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        );
    }
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500,
            }}
            className={TranSingleModal}
        >
            <Fade
                in={open}
            >
                <div>
                {transactions.map(transaction=>(
                    <Grid spacing={2} key={transaction._id} container className={TranSingleModalContent}>
                        <Grid item lg={12} xl={12} sm={12}>
                            <TextField 
                                variant="outlined"
                                size="small"
                                label="Receipt No.#"
                                fullWidth
                                disabled
                                value={transaction._id}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={8} xl={8} sm={8}>
                            <TextField 
                                variant="outlined"
                                size="small"
                                label="Customer Name"
                                fullWidth
                                disabled
                                value={transaction.customer_name}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <TextField 
                                variant="outlined"
                                size="small"
                                label="Payment Type"
                                fullWidth
                                disabled
                                value={transaction.payment_type}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                        </InputAdornment>
                                    ),
                                    style : transaction.payment_type === 'full' ? { color : "green" } : { color : "maroon" }
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <NumberFormat                  
                                disabled={transaction.payment_type === 'full' ? true : false}               
                                value={transaction.payment_type === 'full' ? transaction.total_price : transaction.change_amount}
                                customInput={TextField}
                                thousandSeparator={true}
                                decimalScale={2}
                                decimalSeparator={'.'}
                                fixedDecimalScale={true}
                                prefix="Php "
                                fullWidth
                                allowNegative={false}
                                size="small"
                                variant="outlined"
                                label={transaction.payment_type === 'full' ? "Fully Paid" : "Balance  "}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                        </InputAdornment>
                                    ),   
                                    style : { color : "green" }
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <NumberFormat 
                                disabled={transaction.payment_type === 'full' ? true : false}
                                value={payment.partial_payments}
                                customInput={TextField}
                                thousandSeparator={true}
                                decimalScale={2}
                                decimalSeparator={'.'}
                                fixedDecimalScale={true}                                
                                prefix="Php "
                                fullWidth
                                size="small"
                                variant="outlined"
                                label="Amount"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                        </InputAdornment>
                                    ),
                                    style : { color : "green" }
                                }}
                                onChange={(e)=>{
                                    let price = e.target.value.split('Php ')[1];
                                    setPayment(payment=>{
                                        return {
                                            ...payment,
                                            partial_payments : parseFloat(price)
                                        }
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} xl={4} sm={4}>
                            <Button                               
                                disabled={transaction.payment_type === 'full' ? true : false}
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<FontAwesomeIcon icon={faSave} />}
                                onClick={async()=>{
                                    const res = await dispatch( updateTransaction({
                                        opt : {
                                            url : `/transactions/${transaction._id}`
                                        },
                                        value : payment
                                    }) );

                                    if( updateTransaction.fulfilled.match(res) ){
                                        dispatch( OpenNotification({
                                            message : "Transaction has been updated.",
                                            severity : "success"
                                        }) );
                                        handleClose();
                                    }else if( updateTransaction.rejected.match(res) ){
                                        dispatch( OpenNotification({
                                            message : "Transaction not updated.",
                                            severity : "error"
                                        }) );
                                        handleClose();
                                    }
                                }}
                            >Update</Button>
                        </Grid>
                        <Grid item lg={12} xl={12} sm={12}>
                            <TableContainer component={Paper} elevation={3}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Payment History</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transaction.payments.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map((payment,i)=>(
                                            <TableRow key={i} hover>
                                                <TableCell>{formatter.format(payment)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[3]}
                                                count={transaction.payments.length}
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
                        <Grid item lg={12} xl={12} sm={12}>
                            <ButtonGroup>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<FontAwesomeIcon icon={faPrint} />}
                                    onClick={async()=>{
                                        const resTransactionRep = await dispatch(createTransactionReport(`/transactions/${transaction._id}`));
                                        if( createTransactionReport.fulfilled.match(resTransactionRep) ){
                                            
                                            const { doc,logo } = resTransactionRep.payload;
                                            let pdf = JSON.parse(doc);
                                                                                      
                                            if( pdf.length > 0 ){                                                
                                                pdfmake.vfs = pdfmakeFonts.pdfMake.vfs;
                                                const docDef = TransactionDoc(pdf,logo);
                                                const docGenerator = pdfmake.createPdf(docDef);

                                                docGenerator.getBase64(data=>{
                                                    socket.emit('printcmd',{
                                                        data,
                                                        id,
                                                        settings
                                                    });
                                                });
                                            }
                                        }else if(createTransactionReport.rejected.match(resTransactionRep)){
                                            dispatch(OpenNotification({
                                                message : `Error generating transaction. ${resTransactionRep.payload}`,
                                                severity : "error"
                                            }));
                                        }
                                    }}
                                >
                                    Print
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    style={{
                                        background : "green",
                                        color : "#fff"
                                    }}
                                    startIcon={<FontAwesomeIcon icon={faEye} />}
                                    onClick={ async()=>{
                                        const resTransactionRep = await dispatch(createTransactionReport(`/transactions/${transaction._id}`));
                                        if( createTransactionReport.fulfilled.match(resTransactionRep) ){
                                            
                                            const { doc,logo } = resTransactionRep.payload;
                                            let pdf = JSON.parse(doc);
                                                                                      
                                            if( pdf.length > 0 ){                                                
                                                pdfmake.vfs = pdfmakeFonts.pdfMake.vfs;
                                                const docDef = TransactionDoc(pdf,logo);
                                                const docGenerator = pdfmake.createPdf(docDef);
                                                
                                                docGenerator.getBlob(blob=>{
                                                    let url = window.URL.createObjectURL(blob);
                                                    history.push(`/transactions/print/${transaction._id}?pdf=${url}`);                                                    
                                                });
                                            }
                                        }else if(createTransactionReport.rejected.match(resTransactionRep)){
                                            dispatch(OpenNotification({
                                                message : `Error generating transaction. ${resTransactionRep.payload}`,
                                                severity : "error"
                                            }));
                                        }
                                    }}
                                >View</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                                    onClick={()=>{
                                        history.push(`/transactions/del/${id}`);
                                    }}
                                >Delete</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClose}
                                >Cancel</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                ))}
                </div>                
            </Fade>
        </Modal>
    )
}

export default TransactionSingle
