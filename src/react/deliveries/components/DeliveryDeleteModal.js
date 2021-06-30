import { Backdrop, Button, Fade, Modal,withStyles } from '@material-ui/core'
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
                <div className={classes.DeleteModalContent}>
                    {id}
                    <Button
                        onClick={()=>{
                            handleDelete(id);
                        }}
                    >Yes</Button>&nbsp;
                    <Button
                        onClick={handleClose}
                    >Cancel</Button>
                </div>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(DeliveryDeleteModal)
