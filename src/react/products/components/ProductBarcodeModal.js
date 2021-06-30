import { Backdrop, Grid, Modal, withStyles,Fade } from '@material-ui/core'
import React from 'react'
import BarcodeInfo from '../../components/BarcodeInfo';
import Styles from './Styles';

function ProductBarcodeModal(props) {
    const { classes } = props;
    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}            
        >
            <Fade
                in={props.open}
            >
                <Grid container className={classes.ProductModal}>
                    <Grid item lg={12} sm={12}>
                        <BarcodeInfo data={props.data} />
                    </Grid>
                </Grid>
            </Fade>            
        </Modal>
    )
}

export default withStyles(Styles)(ProductBarcodeModal)
