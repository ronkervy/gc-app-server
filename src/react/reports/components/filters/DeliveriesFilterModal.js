import { Backdrop, Fade, Modal } from '@material-ui/core'
import React,{ useEffect,useState }  from 'react';
import { useHistory } from 'react-router-dom';
import useStyles from './Styles';
import DTPicker from '../DTPicker';
import { useDispatch } from 'react-redux';
import { clearModel, setModel, setUri } from '../../store/ReportSlice';

function DeliveriesFilterModal() {

    const classes = useStyles();
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    const requestDeliveries = (args)=>{
        const {from,to,filter} = args;
        const uri = filter !== 'all' ? `/deliveries?status=${filter}&from=${from}&to=${to}` : `/deliveries?from=${from}&to=${to}`;
        dispatch( setUri( uri ) );
        handleClose();
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
            closeAfterTransition
            className={classes.Modal}
        >
            <Fade
                in={open}
            >
                <div className={classes.paper}>
                    <DTPicker model="deliveries" fn={requestDeliveries} />
                </div>
            </Fade>
        </Modal>
    )
}

export default DeliveriesFilterModal
