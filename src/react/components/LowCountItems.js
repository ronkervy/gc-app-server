import React, { useEffect, useState } from 'react'
import { Modal,Fade,Backdrop } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

function LowCountItems() {
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    useEffect(()=>{
        setOpen(true);
    },[]);
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
        >
            <Fade
                in={open}
            >
                <div>LowCount</div>
            </Fade>
        </Modal>
    )
}

export default LowCountItems
