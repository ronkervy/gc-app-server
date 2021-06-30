import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid,Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import Styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProducts
} from '../products/store/ProdServices';
import { useHistory } from 'react-router-dom';

function Home(props) {

    const { classes } = props;
    const dispatch = useDispatch();
    const products = useSelector(state=>state.products.entities);
    const history = useHistory();

    useEffect(()=>{
        dispatch( getProducts('/products') );
    },[]);

    return (
        <motion.div
            initial={{x : -10,opacity : 0}}
            transition={{duration : .5}}
            animate={{x : 0, opacity : 1}}
        >
            <Grid container>
                <Grid item lg={12}>
                    <h3>Overview</h3>
                </Grid>                
            </Grid>
            <Grid container className={classes.HomeWrap} spacing={2}>
                <Box container
                    component={motion.div}
                    whileHover={{
                        scale : 1.1
                    }}
                    lg={4} 
                    sm={4}
                    boxShadow={2}
                    className={classes.boxOverview}                             
                >
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <h2 style={{margin: "0px",textAlign : "left"}}>
                            { products !== undefined ? products.length <= 0 ? 0 : products.length : null}
                        </h2>
                        <p style={{margin: "0px"}}>Current Items</p>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <FontAwesomeIcon size="3x" color="#FFBB38" icon={faBox} />
                    </Grid>
                </Box>
                <Box 
                    component={motion.div}
                    whileHover={{
                        scale : 1.1
                    }}                
                    lg={4} 
                    sm={4}
                    boxShadow={2} 
                    className={classes.boxOverview}            
                >
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <h2 style={{margin: "0px",textAlign : "left"}}>3400</h2>
                        <p style={{margin: "0px"}}>Running Low</p>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <FontAwesomeIcon size="3x" color="#16DBCC" icon={faBox} />
                    </Grid>
                </Box>
                <Box 
                    component={motion.div}
                    whileHover={{
                        scale : 1.1
                    }}                
                    lg={4} 
                    sm={4}
                    boxShadow={2} 
                    className={classes.boxOverview}             
                >
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <h2 style={{margin: "0px",textAlign : "left"}}>2400</h2>
                        <p style={{margin: "0px"}}>Test</p>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        sm={4}
                    >
                        <FontAwesomeIcon size="3x" color="#396AFF" icon={faBox} />
                    </Grid>
                </Box>
            </Grid>
            <Grid container spacing={4}>
                <Grid item sm={4} lg={4}>
                    <h3>Current Balance</h3>
                    <Grid container spacing={3}>
                        <Grid item sm={12} lg={12}>
                            <Box
                                component={motion.div}
                                boxShadow={2} 
                                className={classes.boxCurrentBal}                            
                            >
                                Earning this month
                            </Box>
                        </Grid>
                        <Grid item sm={12} lg={12}>
                            <Box
                                component={motion.div}          
                                lg={4} 
                                sm={4}
                                boxShadow={2}     
                                className={classes.boxCurrentBal}                              
                            >
                                Transaction this month
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>         
                <Grid item sm={8} lg={8}>
                    <h3>Earning Summary</h3>
                    <Grid container>
                        <Grid item sm={12} lg={12}>
                            <Box
                                component={motion.div}        
                                lg={6} 
                                boxShadow={2}      
                                className={classes.boxSummary}                
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={6} sm={6}>
                                        <Box
                                            component={motion.div}
                                            boxShadow={2}
                                        >Top Selling</Box>
                                    </Grid>
                                    <Grid item lg={6} sm={6}>
                                        <Box
                                            component={motion.div}
                                            boxShadow={2}
                                        >Average Order</Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>                        
                    </Grid>
                </Grid>                
            </Grid>
        </motion.div>
    )
}

export default withStyles(Styles)(Home)
