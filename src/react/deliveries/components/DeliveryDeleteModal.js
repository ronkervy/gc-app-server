import { Backdrop, Button, Fade, Modal,withStyles,Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { DeleteDelivery } from '../store/DelServices';
import Styles from './Styles';

function DeliveryDeleteModal(props) {

    const { classes } = props;
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const [open,setOpen] = useState(false);

    useEffect(()=>{
        setOpen(true);
    },[]);

    const handleDelete = async(id)=>{
        const res = await dispatch( DeleteDelivery({
            opt : {
                url : '/deliveries/' + id
            }
        }));

        if( DeleteDelivery.fulfilled.match(res) ){
            handleClose();
        }

    }

    const handleClose = ()=>{
        setOpen(false);
        history.goBack();        
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
            className={classes.DeleteModal}
        >
            <Fade
                in={open}
            >
                <Grid container spacing={2} className={classes.DeleteModalContent}>
                    <Grid item lg={12} sm={12}>
                        <h3 style={{ textAlign : "center" }}>Delete this item?</h3>
                    </Grid>
                    <Grid item lg={4} sm={4}>
                        <Button
                            fullWidth
                            color="secondary"
                            variant="contained"
                            onClick={()=>{
                                handleDelete(id);
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

export default withStyles(Styles)(DeliveryDeleteModal)
