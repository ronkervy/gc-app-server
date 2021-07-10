import { AppBar, Toolbar,withStyles,IconButton, Grid,Badge, Divider } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Styles from './Styles';
import React from 'react';
import {
    Close,
    Image,
    Minimize,
    Notifications,
} from '@material-ui/icons';
import logo from 'Public/img/logo.png';
import { motion } from 'framer-motion';


function MainBar(props) {

    const {classes} = props;
    const currDate = new Date(Date.now()).toDateString();

    const { ipcRenderer } = window.require('electron');

    const CloseWin = ()=>{
        ipcRenderer.invoke('close');
    }
    
    const MinWin = ()=>{
        ipcRenderer.invoke('min');
    }    

    return (
        <AppBar position="fixed" className={classes.MainBar} style={{WebkitAppRegion: "drag"}}>
            <Toolbar variant="dense">
                <Grid container>
                    <Grid 
                        item xs={8} 
                        lg={8} 
                        className={classes.titleHead}
                    >
                        <img height="24" width="24" src={logo} />&nbsp;&nbsp;<h5>GC Application</h5>
                        <Divider style={{ margin : "0px 10px", alignSelf : "center", height: "25px"}} variant="fullWidth" orientation="vertical" flexItem />
                        <CalendarTodayIcon />&nbsp;<h5>{currDate}</h5>
                    </Grid>
                    <Grid item xs={2} lg={3} className={classes.MainBarRightBtns}>
                        <IconButton
                            disableRipple={true}     
                            size="small"
                            component={motion.div}
                            whileHover={{ scale : 1.1 }}
                        >
                            <Badge badgeContent={4} color="secondary" style={{ WebkitAppRegion : "no-drag" }}>
                                <Notifications />
                            </Badge>
                        </IconButton>   
                    </Grid>
                    <Grid item xs={2} lg={1} className={classes.MainBarRightBtns}>
                        <IconButton
                            color="primary"
                            onClick={MinWin}
                            disableRipple={true}
                            size="small"
                            edge="start"
                            component={motion.button}
                            whileHover={{scale : 1.1}}         
                        >
                            <Minimize />
                        </IconButton>
                        <IconButton
                            color="secondary"
                            onClick={CloseWin}
                            disableRipple={true}
                            size="small"
                            component={motion.button}
                            whileHover={{scale : 1.1}}
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>             
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(Styles)(MainBar)