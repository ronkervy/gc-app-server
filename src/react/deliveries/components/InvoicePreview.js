import { Backdrop, Fab, Fade, Modal, withStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router';
import Styles from './Styles';
import { Close } from '@material-ui/icons';


export const useQuery = ()=>{
    return new URLSearchParams(useLocation().search);
}

function InvoicePreview(props) {

    const {classes} = props;
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const query = useQuery();
    const pdf = query.get("pdf");

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
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}       
        >
            <Fade
                in={open}                
            >
                <div className={classes.InvoiceModal}>
                    <Fab
                        size="small"
                        variant="round"
                        onClick={handleClose}
                        style={{
                            position : "absolute",
                            left : 20,
                            top : 20,          
                            WebkitAppRegion : "no-drag"          
                        }}
                    >
                        <Close />
                    </Fab>
                    <iframe       
                        title="Invoice"                  
                        style={{
                            border : "none",                            
                        }} 
                        onClick={handleClose}                         
                        src={pdf+'#toolbar=1'} 
                        width="100%" 
                        height="100%"
                    ></iframe>
                </div>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(InvoicePreview)
