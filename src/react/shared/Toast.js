import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import React from 'react';
import { useSelector } from 'react-redux';

function Toast(props) {

    const { handleCloseToast } = props;
    const { message,severity,open } = useSelector(state=>state.notifications);

    return (
        <Snackbar
            open={open} 
            autoHideDuration={4000} 
            onClose={handleCloseToast}
            anchorOrigin={{vertical : 'bottom',horizontal : 'right'}}
        >
            <Alert
                elevation={6} 
                variant="filled"
                onClose={handleCloseToast}
                severity={severity}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default Toast
