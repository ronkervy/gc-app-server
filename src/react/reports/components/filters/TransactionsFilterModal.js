import { Modal,Backdrop,Fade} from '@material-ui/core';
import React,{ useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom';
import useStyles from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../shared/Loader';
import { clearModel, setModel, setUri } from '../../store/ReportSlice';
import DTPicker from '../DTPicker';

function TransactionsFilterModal(props) {

    const classes = useStyles();

    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const [url,setUrl] = useState('');
    const { loading } = useSelector(state=>state.report);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);        
    }

    const requestReport = (args)=>{
        const { from,to,filter } = args;
        const uri = filter !== 'all' ? `/transactions?payment_type=${filter}&from=${from}&to=${to}` : `/transactions?from=${from}&to=${to}`;
        dispatch( setUri(uri) );
        handleClose();
    }

    useEffect(()=>{
        dispatch( setModel('transactions') );
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
            closeAfterTransition
            className={classes.Modal}
        >
            <Fade
                in={open}
            >
                <div className={classes.paper}>
                    <DTPicker model="transactions" fn={requestReport} />
                </div>
            </Fade>
        </Modal>
    )
}

export default TransactionsFilterModal
