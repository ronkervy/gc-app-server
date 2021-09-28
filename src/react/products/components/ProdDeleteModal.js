import React, { useEffect, useState } from 'react';
import { Backdrop, Button, Fade, Grid, Modal,withStyles } from '@material-ui/core';
import Styles from './Styles';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from '../store/ProdServices';
import Loader from '../../shared/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { io } from 'socket.io-client';
 
function ProdDeleteModal(props) {
    
    const { classes } = props;
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading } = useSelector(state=>state.products);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    useEffect(()=>{
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
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}          
            aria-labelledby="Delete this item?"
            aria-describedby="simple-modal-description"
            className={classes.DeleteModal}
        >
            <Fade
                in={open}
            >                
                <Grid container spacing={2} className={classes.DeleteModalContent}>                        
                        <Grid item lg={12} xl={12} sm={12}>
                            <h4>Delete this item?</h4>
                        </Grid>
                        <Grid
                            item 
                            lg={4} 
                            xl={4}
                            sm={4}                            
                        >
                            <Button    
                                fullWidth                        
                                variant="contained"
                                color="secondary"
                                onClick={ async()=>{
                                    const resDelete = await dispatch(deleteProduct({
                                        opt : {
                                            url : `/products/${id}`
                                        }
                                    }));

                                    if( deleteProduct.fulfilled.match(resDelete) ){       
                                        const socket = io('http://localhost:8081/');
                                        socket.emit('deleted_product',{
                                            message : "item deleted"
                                        });                                 
                                        dispatch(OpenNotification({
                                            message : "Item has been deleted.",
                                            severity : "success"
                                        }));
                                        handleClose();
                                    }else{
                                        dispatch(OpenNotification({
                                            message : "Item not deleted. There has been an error.",
                                            severity : "error"
                                        }));
                                    }
                                    
                                }}
                            >Yes</Button>                                                
                        </Grid>                   
                        <Grid item lg={4} xl={4} sm={4}>
                            <Button
                                color="primary"
                                fullWidth
                                variant="contained"
                                onClick={handleClose}
                            >No</Button>
                        </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(ProdDeleteModal)
