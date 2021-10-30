import { Backdrop, Fade, Modal,makeStyles, Grid, TextField, MenuItem, Button, Typography } from '@material-ui/core'
import { Save } from '@material-ui/icons';
import React,{ useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../Loader';
import { getSettings, saveSettings } from '../store/SettingsService';
import { io } from 'socket.io-client';

const useStyles = makeStyles((theme)=>({
    ModalSettings : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center"
    },
    ModalContent : {
        background : "#ffffff",
        width : "450px",
        height : "auto",
        padding : "30px",
        outline : "none"
    }
}));

const socket = io('http://localhost:8081');

function Settings() {

    const { ipcRenderer } = window.require('electron');
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { entities, loading } = useSelector(state=>state.settings);
    const { ModalSettings,ModalContent } = useStyles();
    const [defaultPrinter,setDefaultPrinter] = useState({
        printer : {
            default : '',
            list : [],
            options : {
                silent: false,
                monochrome : true,
                scale: "none",
                orientation : "portrait"
            }
        }
    });
    
    const [ipAddress,setIPAddress] = useState('');    
    
    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }
    
    const handleChange = (e)=>{
        setDefaultPrinter(state=>{
            let printerVal = e.target.value;
            return {
                ...state,
                printer : {
                    ...state.printer,
                    default : printerVal
                }
            }
        });        
    }

    const handleChangeMonochrome = (e)=>{
        setDefaultPrinter(state=>{
            return {
                ...state,
                printer : {
                    ...state.printer,
                    options : {
                        ...state.printer.options,
                        monochrome : e.target.value
                    }
                }
            }
        });    
    }

    const handleChangeOrientation = (e)=>{
        setDefaultPrinter(state=>{
            return {
                ...state,
                printer : {
                    ...state.printer,
                    options : {
                        ...state.printer.options,
                        orientation : e.target.value
                    }
                }
            }
        });
    }

    const handleScaleChange = (e)=>{
        setDefaultPrinter(state=>{
            return {
                ...state,
                printer : {
                    ...state.printer,
                    options : {
                        ...state.printer.options,
                        scale : e.target.value
                    }
                }
            }
        });
    }

    const loadDefaultPrinter = async()=>{
        const res = await dispatch( getSettings() );

        if( getSettings.fulfilled.match(res) ){
           const { settings } = res.payload;
           setDefaultPrinter(state=>{
               return {
                   ...settings,
                   printer : {
                       ...settings.printer,
                       default : settings.printer.default
                   }
               }
           });
        }
    }

    useEffect(()=>{
        ipcRenderer.invoke('get-ip').then(args=>{
            setIPAddress(args);
        });               
        loadDefaultPrinter();
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Modal
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            className={ModalSettings}
        >
            <Fade
                in={open}
            >
                <Grid container className={ModalContent} spacing={2}>
                    <Grid item lg={12} xl={12} sm={12}>
                        <TextField 
                            fullWidth
                            size="small"
                            variant="outlined"
                            value={ipAddress}
                            label="IP Address"
                        />
                    </Grid>
                    <Grid item lg={12} xl={12} sm={12}>
                        <Typography variant="h6">Printer Options</Typography>
                    </Grid>
                    <Grid item lg={6} xl={6} sm={6}>
                        <TextField 
                            fullWidth
                            select
                            size="small"
                            variant="outlined"
                            label="Monochrome"
                            value={defaultPrinter.printer.options.monochrome}
                            onChange={handleChangeMonochrome}
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item lg={6} xl={6} sm={6}>
                        <TextField 
                            fullWidth
                            select
                            size="small"
                            variant="outlined"
                            label="Orientation"
                            value={defaultPrinter.printer.options.orientation}
                            onChange={handleChangeOrientation}
                        >
                            <MenuItem value="landscape">Landscape</MenuItem>
                            <MenuItem value="portrait">Protrait</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item lg={12} xl={12} sm={12}>
                        <TextField 
                            fullWidth
                            select
                            size="small"
                            variant="outlined"
                            label="Scale"
                            value={defaultPrinter.printer.options.scale}
                            onChange={handleScaleChange}
                        >
                            <MenuItem value="none">No Scale</MenuItem>
                            <MenuItem value="shrink">Shrink</MenuItem>
                            <MenuItem value="fit">Fit to page</MenuItem>
                        </TextField>
                    </Grid>                                   
                    <Grid item lg={8} xl={8} sm={8}>
                        <TextField 
                            select
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Default Printer"
                            value={defaultPrinter.printer.default}  
                            onChange={handleChange}                       
                        >
                            {defaultPrinter.printer.list.map((printer,i)=>(
                                <MenuItem 
                                    key={i}       
                                    value={printer}                             
                                >{printer}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={4} xl={4} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="medium"
                            startIcon={<Save />}
                            onClick={async()=>{
                                ipcRenderer.invoke("changeDefaultPrinter",defaultPrinter.printer.default);
                                socket.emit("default-printer",defaultPrinter.printer.default);
                                
                                await dispatch(saveSettings({
                                    settings : defaultPrinter
                                }));
                            }}
                        >Save</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default Settings
