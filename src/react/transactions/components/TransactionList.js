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
    Toolbar 
} from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { getAllTransaction } from '../store/TransactionServices';
import TransactionItems from './TransactionItems';

const TransComp = forwardRef((props,ref)=>{
    return <Slide direction="up" {...props} ref={ref} />
});

function TransactionList(props) {

    const { search : data,mode } = props;
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    
    const { loading, entities : transactions } = useSelector(state=>state.transactions);
    const history = useHistory();

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }
    
    useEffect(()=>{

        if( mode === 'search' ){

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
            style={{
                padding : "30px",
            }}
        >
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Grid container spacing={2}>
                        <Grid item lg={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
                            <IconButton
                                disableRipple={true}
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} sm={10}>                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item lg={12} sm={12}>
                    <TableContainer component={Paper} elevation={3} >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ textAlign : "center" }}>Customer Name</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Transaction Date</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Payment Type</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Cash Amount</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Total</TableCell>
                                    <TableCell style={{ textAlign : "center" }}>Change</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction,i)=>(
                                    <TransactionItems data={transaction} key={i} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Dialog>
    )
}

export default TransactionList
