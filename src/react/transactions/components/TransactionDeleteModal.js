import { Fade, Grid, Modal, makeStyles, Backdrop, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../../shared/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { deleteTransaction } from '../store/TransactionServices';

const useStyles = makeStyles(()=>({
    TransDeleteModal : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center"
    },
    TransDeleteModalContent : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        outline : "none",
        background : "#ffffff",
        padding : "30px",
        width : "350px",
        borderRadius : "10px"
    }
}));

function TransactionDeleteModal() {
    
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams();
    const { loading, entities : transactions } = useSelector(state=>state.transactions);
    const history = useHistory();
    const { TransDeleteModal,TransDeleteModalContent } = useStyles();
    
    const handleClose = ()=>{
        setOpen(false);
        history.goBack();
    }

    const handleDelete = async()=>{
        const resDel = await dispatch( deleteTransaction({
            opt : {
                url : `/transactions/${id}`
            }
        }) );

        if( deleteTransaction.fulfilled.match(resDel) ){
            dispatch(OpenNotification({
                message : "Transaction has been deleted.",
                severity : "success"
            }));
            handleClose();
        }else if( deleteTransaction.rejected.match(resDel) ){
            dispatch(OpenNotification({
                message : `Transaction not deleted error : ${resDel.payload}`,
                severity : "error"
            }));
        }
    }

    useEffect(()=>{
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
            BackdropProps={{
                timeout : 500
            }}
            BackdropComponent={Backdrop}
            className={TransDeleteModal}
        >
            <Fade
                in={open}
            >
                <Grid container spacing={2} className={TransDeleteModalContent}>
                    <Grid item lg={12} xl={12} sm={12}>
                        <h3 style={{ textAlign : "center" }}>Delete this item?</h3>
                    </Grid>
                    <Grid item lg={4} xl={4} sm={4}>
                        <Button
                            fullWidth
                            size="medium"
                            variant="contained"
                            color="secondary"
                            onClick={handleDelete}
                        >Delete</Button>
                    </Grid>
                    <Grid item lg={4} xl={4} sm={4}>
                        <Button
                            fullWidth
                            size="medium"
                            variant="contained"
                            color="primary"
                            onClick={handleClose}
                        >Cancel</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default TransactionDeleteModal
