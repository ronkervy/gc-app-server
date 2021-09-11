import { Backdrop, Fab, Fade, makeStyles, Modal } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';

const useQuery = ()=>{
    return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles((theme)=>({
    ModalPrint : {
        height : "100%",
        outline : "none",
        padding : "30px"
    }
}));

function TransactionPrint(props) {
    
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const pdf = useQuery().get('pdf');
    const { ModalPrint } = useStyles();

    const handleClose = ()=>{
        setOpen(false);
        history.goBack();        
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
                <div className={ModalPrint}>
                    <Fab
                        size="small"
                        variant="circular"
                        onClick={handleClose}
                        style={{
                            position : "absolute",
                            left : 15,
                            top : 8,          
                            WebkitAppRegion : "no-drag"          
                        }}
                    >
                        <Close />
                    </Fab>
                    <iframe
                        style={{
                            border : "none",    
                            WebkitAppRegion : 'no-drag'                        
                        }} 
                        width="100%"
                        height="100%"
                        src={pdf+'#toolbar=1'}
                    ></iframe>
                </div>
            </Fade>
        </Modal>
    )
}

export default TransactionPrint
