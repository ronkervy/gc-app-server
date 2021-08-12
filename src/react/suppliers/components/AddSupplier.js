import React,{useEffect,useState,forwardRef} from 'react';
import { faAddressBook, faMailBulk, faMobile, faSave, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';
import { 
    AppBar,
    Grid, 
    InputAdornment, 
    TextField, 
    Toolbar,
    IconButton,
    Slide,
    Dialog,
    withStyles,
    Paper,
    Button,
    TextareaAutosize,
    Divider
} from '@material-ui/core';
import {
    Close
} from '@material-ui/icons';
import { useFormik } from 'formik';
import { useHistory } from 'react-router';
import Styles from './Styles';
import { useDispatch } from 'react-redux';
import { createSupplier } from '../store/SupplierServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';

const Transition = forwardRef(function Transition(props,ref){
    return <Slide
        direction="up" ref={ref} {...props}
    />
});

function AddSupplier(props) {

    const { classes } = props;
    const dispatch = useDispatch();

    const history = useHistory();

    const initialValues = {
        supplier_name : '',
        supplier_contact : '',
        supplier_email : '',
        supplier_address : '',
        supplier_memo : ''    
    };

    const [openDialog,setOpenDialog] = useState(false);

    const handleCloseDialog = ()=>{
        setOpenDialog(()=>{
            history.goBack();
            return false;
        });
        
    }

    useEffect(()=>{
        setOpenDialog(true);
    },[]);

    const formik = useFormik({
        initialValues,
        onSubmit : async (values,{resetForm})=>{
            const res = await dispatch(createSupplier({
                opt : {
                    url : '/suppliers'
                },
                values : values
            }));

            if( createSupplier.fulfilled.match(res) ){
                dispatch( OpenNotification({
                    message : "Supplier has been added.",
                    severity : "success"
                }) );
                resetForm();
            }else{
                dispatch( OpenNotification({
                    message : "Supplier not added.",
                    severity : "error"
                }) );
            }
        }
    });

    return (
        <Dialog
            fullScreen
            open={openDialog}
            onClose={handleCloseDialog}
            TransitionComponent={Transition}
            onKeyPress={(e)=>{
                if(e.key === 'Esc'){
                    handleCloseDialog();
                }
            }}         
            style={{ padding : "50px" }}
        >
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Grid container spacing={2}>
                        <Grid item lg={2} sm={2} style={{WebkitAppRegion: "no-drag"}}>
                            <IconButton
                                disableRipple={true}
                                size="small"
                                edge="start"
                                color="inherit"
                                onClick={handleCloseDialog}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>                                                
                        </Grid>
                        <Grid item lg={10} sm={10}>                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid container className={classes.AddSupplierWrap}>                
                <form onSubmit={formik.handleSubmit} style={{width : "500px",height : "500px"}}>                    
                    <Grid item container spacing={2} component={Paper} elevation={3} style={{padding : "30px"}}>
                    <Grid item lg={6} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faUser} />
                                        </InputAdornment>
                                    )
                                }}
                                id="supplier_name"
                                value={formik.values.supplier_name}
                                placeholder="Supplier Name"
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6}>
                            <TextField
                                fullWidth 
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMailBulk} />
                                        </InputAdornment>
                                    )
                                }}
                                id="supplier_email"
                                value={formik.values.supplier_email}
                                placeholder="Email Address"
                                onChange={formik.handleChange}
                            />
                        </Grid>     
                        <Divider />
                        <Grid item lg={8} sm={8}>
                            <NumberFormat
                                customInput={TextField}
                                format="#### ### ####"
                                fullWidth 
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMobile} />
                                        </InputAdornment>
                                    )
                                }}
                                id="supplier_contact"
                                value={formik.values.supplier_contact}
                                placeholder="Contact Number"
                                onChange={formik.handleChange}
                            />
                        </Grid>                    
                        <Grid item lg={12} sm={12}>
                            <TextField
                                fullWidth 
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faAddressBook} />
                                        </InputAdornment>
                                    )
                                }}
                                id="supplier_address"
                                value={formik.values.supplier_address}
                                placeholder="Address"
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <TextareaAutosize 
                                maxRows="6" 
                                placeholder="Memo"
                                style={{width : "100%",height : "150px",padding: "10px"}}
                                id="supplier_memo"
                                onChange={formik.handleChange}
                                value={formik.values.supplier_memo}
                            >
                            </TextareaAutosize>
                        </Grid>
                        <Grid item lg={12} sm={12}>
                                <Button
                                    startIcon={
                                        <FontAwesomeIcon icon={faSave} />
                                    }
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                >Save</Button>
                        </Grid>                            
                    </Grid>          
                </form>
            </Grid>
        </Dialog>
    )
}

export default withStyles(Styles)(AddSupplier)
