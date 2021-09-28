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
    faBoxes,
    faReceipt,
    faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import NavStyle from './Styles';
import { useSelector } from 'react-redux';

function Nav(props) {
    
    const { classes } = props;

    return (
        <Box className={classes.AppNav} boxShadow={2}>       
            <Grid container>
                <Grid item sm={12} xl={12} lg={12}><h3><FontAwesomeIcon icon={faBars} />&nbsp;&nbsp;Menu</h3></Grid>
            </Grid>            
            <NavLink exact to='/'><FontAwesomeIcon icon={faHome} /> Home</NavLink>
            <NavLink exact to='/deliveries'><FontAwesomeIcon icon={faTruckLoading} /> Deliveries</NavLink>
            <NavLink exact to='/suppliers'><FontAwesomeIcon icon={faUserTie} /> Suppliers</NavLink>
            <NavLink exact to={{
                pathname : '/reports',
                state : {
                    apiURL : ''
                }
            }}><FontAwesomeIcon icon={faNewspaper} /> Reports</NavLink>
            <Grid container>
                <Grid item sm={12}><h3><FontAwesomeIcon icon={faBoxes} />&nbsp;&nbsp;Products</h3></Grid>
            </Grid>
            <NavLink exact to='/products'><FontAwesomeIcon icon={faBoxOpen} /> Products</NavLink>
            <NavLink exact to='/products/add/new'><FontAwesomeIcon icon={faPlusSquare} />Add</NavLink>
            <Grid container>
                <Grid item sm={12}><h3><FontAwesomeIcon icon={faDollarSign} />&nbsp;&nbsp;Sales</h3></Grid>
            </Grid>            
            <NavLink exact to='/transactions'><FontAwesomeIcon icon={faReceipt} />Transcations</NavLink>
        </Box>
    )
}

export default withStyles(NavStyle)(Nav)
