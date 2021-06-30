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
        </div>
    )
}

export default withStyles(useStyles)(Loader)
