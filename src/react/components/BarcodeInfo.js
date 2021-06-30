import React,{useEffect} from 'react';
import { withStyles } from '@material-ui/core';
import Styles from './Styles';
import NumberFormat from 'react-number-format';
// const jsbarcode = require('jsbarcode');


function BarcodeInfo(props) {

    const {
        classes,
        data
    } = props;
    const dnow = new Date(data.createdAt).toLocaleDateString('en-US',{month : 'short',year : 'numeric',day : '2-digit'});

    useEffect(()=>{        
        // jsbarcode("#bcode",data.item_code,{
        //     textPosition : "bottom",
        //     textMargin : 3,
        //     font : "Roboto",
        //     fontSize : 9,
        //     lineColor : "#900000",
        //     fontOptions : "bold",
        //     height : 45,
        //     width : 1,
        //     displayValue : true,
        //     text : data.item_name
        // });
    },[data]);

    return (
        <div className={classes.barcodeWrap}>   
            <h3 style={{margin : "0px"}}>{dnow}</h3>        
            <canvas
                style={{textTransform : "uppercase"}}
                id="bcode"
            ></canvas>
            <h4>Price : <NumberFormat 
                displayType="text" 
                value={props.data.item_price} 
                thousandSeparator={true} 
                prefix={'Php '} 
                decimalScale={2} 
                decimalSeparator={'.'}
                fixedDecimalScale={true}                
            /></h4>
            <h4>SP : <NumberFormat 
                displayType="text" 
                value={props.data.item_selling_price} 
                thousandSeparator={true} 
                prefix={'Php '} 
                decimalScale={2} 
                decimalSeparator={'.'}
                fixedDecimalScale={true}
            /></h4> 
        </div>
    )
}

export default withStyles(Styles)(BarcodeInfo)