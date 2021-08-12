import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid,Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import Styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox, faBoxOpen, faDollarSign, faMoneyBill, faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProducts
} from '../products/store/ProdServices';

import { useHistory } from 'react-router-dom';
import Loader from '../shared/Loader';
import { getAllTransaction } from '../transactions/store/TransactionServices';
import ChartHome from './charts/Chart';
import WeeklyChart from './charts/WeeklyChart';

function Home(props) {

    const { classes } = props;
    const dispatch = useDispatch();
    const { entities : products,loading } = useSelector(state=>state.products);
    const { entities : transactions, loading : transLoading } = useSelector( state=>state.transactions );
    const history = useHistory();

    const formatter = new Intl.NumberFormat('en-PH',{
        style : 'currency',
        currency : 'Php'
    });

    const filterLowCounts = (prods)=>{
        const lowArr = [];
        prods.map(prod=>{
            if(prod.item_qty <= 10){
                lowArr.push(prod);
            }
        });
        return lowArr.length;
    }

    const filterCountCurrentSales = (trans)=>{
        const currSales = [];
        trans.map(transaction=>{
            currSales.push(transaction.transaction_date);
        });
        return currSales.length;
    }

    const filterTransactionCount = (trans)=>{
        const currDate = new Date(Date.now()).toISOString().split('T')[0];
        let transArr = [];
        trans.map(transaction=>{
            const transDate = transaction.transaction_date.split('T')[0];            
            if( transDate === currDate ){
                transArr.push(transaction);
            }
        });
        return transArr.length;
    }

    const filterTotalMonthlySales = (trans)=>{
        const currDate = new Date(Date.now()).toISOString().split('T')[0];
        const priceArr = [];

        trans.map(transaction=>{
            const transDate = transaction.transaction_date.split('T')[0];
            if( transDate === currDate ){
                priceArr.push(transaction.total_price);
            }
        });

        return priceArr.reduce((a,b)=>a+b,0);
    }

    useEffect(()=>{
        dispatch( getProducts('/products') );
        dispatch( getAllTransaction({
            opt : {
                url : '/transactions'
            }
        }) );
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }    

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
                        <h2 style={{margin: "0px",textAlign : "left"}}>{filterLowCounts(products)}</h2>
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
                        <h2 style={{margin: "0px",textAlign : "left"}}>
                            {filterCountCurrentSales(transactions)}
                        </h2>
                        <p style={{margin: "0px"}}>Total Sales</p>
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
                    <h3>Income</h3>
                    <Grid container spacing={3}>
                        <Grid item sm={12} lg={12}>
                            <Box                                                                
                                container
                                component={motion.div}
                                boxShadow={2} 
                                className={classes.boxCurrentBal}     
                                whileHover={{
                                    scale : .9
                                }}                       
                            >                                
                                <Grid item lg={4} sm={4}>
                                    <h4
                                        style={{margin: "0px"}}
                                    >{formatter.format(filterTotalMonthlySales(transactions))}</h4>
                                    <p style={{margin: "0px"}}>Earnings this month</p>
                                </Grid>
                                <Grid item lg={4} sm={4} style={{ marginTop : "40px" }}>
                                    <FontAwesomeIcon size="3x" color="#EC861C" icon={faDollarSign} />
                                </Grid> 
                            </Box>
                        </Grid>
                        <Grid item sm={12} lg={12}>                            
                            <Box
                                component={motion.div}          
                                lg={4} 
                                sm={4}
                                boxShadow={2}     
                                className={classes.boxCurrentBal}    
                                whileHover={{
                                    scale : .9
                                }}                            
                            >
                                <Grid item lg={4} sm={4}>
                                    <p style={{margin: "0px"}}>Transactions this month</p>
                                    <h2
                                        style={{margin: "0px"}}
                                    >{filterTransactionCount(transactions)}</h2>                                    
                                </Grid>
                                <Grid item lg={4} sm={4} style={{ marginTop : "25px" }}>
                                    <FontAwesomeIcon size="3x" color="#663394" icon={faReceipt} />
                                </Grid> 
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>         
                <Grid item sm={8} lg={8}>
                    <h3>Monthly Sales Summary</h3>
                    <Grid container>
                        <Grid item sm={12} lg={12}>
                            <Box
                                component={motion.div}        
                                lg={12} 
                                sm={12}
                                boxShadow={2}      
                                className={classes.boxSummary}                
                            >
                                <Grid container spacing={1}>
                                    <Grid item lg={12} sm={12}>
                                        <ChartHome />
                                    </Grid>
                                    <Grid item lg={4} sm={4} >
                                        <WeeklyChart />
                                    </Grid>
                                    <Grid item lg={4} sm={4} >
                                        <WeeklyChart />
                                    </Grid>
                                    <Grid item lg={4} sm={4} >
                                        <WeeklyChart />
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
