import { Backdrop, Fade, Modal,makeStyles, Grid, TextField, MenuItem, Button } from '@material-ui/core'
import { Save } from '@material-ui/icons';
import React,{ useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../Loader';
import { getSettings, saveSettings } from '../store/SettingsService';
import { io } from 'socket.io-client';
import { CmdPrinter } from 'cmd-printer';

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
            options : {}
        }
    });
    const [printerList,setPrinterList] = useState([]);
    const [ipAddress,setIPAddress] = useState('');
    const socket = io('http://localhost:8081');
    
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
                    default : printerVal,
                    list : [...printerList]
                }
            }
        });        
    }

    const getPrinterList = async()=>{
        let printers = await CmdPrinter.getAll();
        printers.map(printer=>{
            setPrinterList(state=>{
                return [
                    ...state,
                    printer.name
                ]
            });
        });
    }

    const loadPrinters = async()=>{
        getPrinterList();      
        const resPrinters = await dispatch( getSettings() );  
        if( getSettings.fulfilled.match(resPrinters) ){
            const { settings } = resPrinters.payload;            
            setDefaultPrinter(state=>{
                return {
                    ...state,
                    printer : {
                        ...state.printer,
                        default : settings.printer.default === undefined ? '' : settings.printer.default,
                    }
                }
            });
        }
    }

    useEffect(()=>{
        ipcRenderer.invoke('get-ip').then(args=>{
            setIPAddress(args);
        });        
        loadPrinters();
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
                    <Grid item lg={12} sm={12}>
                        <TextField 
                            fullWidth
                            size="small"
                            variant="outlined"
                            value={ipAddress}
                            label="IP Address"
                        />
                    </Grid>
                    <Grid item lg={8} sm={8}>
                        <TextField 
                            select
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Default Printer"
                            value={defaultPrinter.printer.default}  
                            onChange={handleChange}                       
                        >
                            {printerList.map((printer,i)=>(
                                <MenuItem 
                                    key={i}       
                                    value={printer}                             
                                >{printer}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={4} sm={4}>
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
