import React, { useEffect, useState } from 'react';
import { Backdrop, Button, Fade, Grid, Modal,withStyles } from '@material-ui/core';
import Styles from './Styles';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams } from 'react-router';

function ProdDeleteModal(props) {
    
    const { classes } = props;
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const { id } = useParams();

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
            aria-labelledby="Delete this item?"
            aria-describedby="simple-modal-description"
        >
            <Fade
                in={open}
            >                
                <Grid container spacing={2} className={classes.DeleteModal}>
                        <Grid item lg={12} sm={12}>
                            <FontAwesomeIcon style={{fontSize : "30px", color: "maroon"}} icon={faTrashAlt} />
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <h2>Delete {id}?</h2>
                        </Grid>
                        <Grid
                            item 
                            lg={12} 
                            sm={12}                            
                        >
                            <Button                            
                                variant="contained"
                            >Yes</Button>&nbsp;&nbsp;
                            <Button
                                variant="contained"
                                onClick={handleClose}
                            >No</Button>                        
                        </Grid>                   
                </Grid>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(ProdDeleteModal)
