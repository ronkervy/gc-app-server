import React from 'react'
import { NavLink } from 'react-router-dom';
import { Box, withStyles,Grid,Switch,FormControlLabel } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTruckLoading,
    faBoxOpen,
    faPlusSquare,
    faHome,
    faNewspaper,
    faUserTie,
    faBars,
    faBoxes
} from '@fortawesome/free-solid-svg-icons';
import NavStyle from './Styles';

function Nav(props) {
    
    const { classes } = props;

    return (
        <Box className={classes.AppNav} boxShadow={2}>       
            <Grid container>
                <Grid item sm={12} lg={12}><h3><FontAwesomeIcon icon={faBars} />&nbsp;&nbsp;Menu</h3></Grid>
            </Grid>            
            <NavLink exact to='/'><FontAwesomeIcon icon={faHome} /> Home</NavLink>
            <NavLink exact to='/deliveries'><FontAwesomeIcon icon={faTruckLoading} /> Deliveries</NavLink>
            <NavLink exact to='/suppliers'><FontAwesomeIcon icon={faUserTie} /> Suppliers</NavLink>
            <NavLink exact to='/reports'><FontAwesomeIcon icon={faNewspaper} /> Reports</NavLink>
            <Grid container>
                <Grid item sm={12}><h3><FontAwesomeIcon icon={faBoxes} />&nbsp;&nbsp;Products</h3></Grid>
            </Grid>
            <NavLink exact to='/products'><FontAwesomeIcon icon={faBoxOpen} /> Products</NavLink>
            <NavLink exact to='/products/add/new'><FontAwesomeIcon icon={faPlusSquare} />Add</NavLink>
            <Grid container>
                <Grid item sm={12}><h3>Settings</h3></Grid>
            </Grid>            
            <FormControlLabel
                control={                    
                    <Switch 
                        color="primary"                        
                    />
                }
                label="Theme Mode"
                style={{color : "#8D9EBD"}}
            />
        </Box>
    )
}

export default withStyles(NavStyle)(Nav)
