import React,{ useState,useEffect } from 'react';
import { Modal,Fade, Grid, Backdrop,withStyles, Button } from '@material-ui/core';
import Styles from './Styles';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSupplier } from '../store/SupplierServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import Loader from '../../shared/Loader';

function DeleteSupplier(props) {

    const [open,setOpen] = useState(false);
    const { DeleteModal,DeleteModalContent } = props.classes;
    const { loading } = useSelector(state=>state.suppliers);
    const dispatch = useDispatch();
    const history = useHistory();

    const { id } = useParams();
    
    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    useEffect(()=>{
        console.log(id);
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
            className={DeleteModal}
        >
            <Fade
                in={open}
            >
                <Grid container spacing={2} className={DeleteModalContent}>
                    <Grid item lg={12} sm={12}>
                        <h3 style={{ textAlign : "center" }}>Delete this item?</h3>
                    </Grid>
                    <Grid item lg={4} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={ async()=>{
                                const res = await dispatch(deleteSupplier({
                                    opt : {
                                        url : `/suppliers/${id}`
                                    }
                                }));

                                if( deleteSupplier.fulfilled.match(res) ){
                                    dispatch(OpenNotification({
                                        message : "Supplier has been deleted.",
                                        severity : "success"
                                    }));
                                    handleClose();
                                }else{
                                    dispatch(OpenNotification({
                                        message : "Supplier not deleted.",
                                        severity : "error"
                                    }));
                                    handleClose();
                                }
                            }}
                        >Yes</Button>
                    </Grid>
                    <Grid item lg={4} sm={4}>
                        <Button
                            fullWidth
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

export default withStyles(Styles)(DeleteSupplier)
