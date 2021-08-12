import React from 'react'
import { 
    withStyles,
    CircularProgress
} from '@material-ui/core';
import useStyles from './Styles';

function Loader(props) {

    const {classes} = props;

    return (
        <div className={classes.Loader} style={{...props.style}}>
            <CircularProgress
                size={70}
            />
            <h4 style={{ textAlign : "center", color : "white", letterSpacing : "10px" }}>Loading</h4>
        </div>
    )
}

export default withStyles(useStyles)(Loader)
