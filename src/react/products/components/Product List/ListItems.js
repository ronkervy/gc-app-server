import React,{useState} from 'react';
import { default as NumberFormat } from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrash,
    faBarcode,
    faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    withStyles,
    TableCell,
    IconButton
} from '@material-ui/core';
import Styles from '../Styles';
import ProductBarcodeModal from '../ProductBarcodeModal';
import { useHistory } from 'react-router';

function ListItems({item,index}) {

    const [open,setOpen] = useState(false);
    const [selectedItem,setSelectedItem] = useState({});
    const history = useHistory();

    const handleOpen = ()=>{
        setOpen(true);
    }
  
    const handleClose = ()=>{        
        setOpen(false);
    }

    return(
        <>            
            <TableCell style={{ fontSize : item.item_name.length >= 30 ? "10px" : "12px", textTransform : "capitalize" }}>{ item.item_name.length >= 30 ? item.item_name.substring(0,30) + '...' : item.item_name }</TableCell>
            <TableCell style={{ fontSize : "12px" }}>{item.item_qty}</TableCell>
            <TableCell style={{ fontSize : "12px" }}>
                <NumberFormat 
                    displayType="text" 
                    value={item.item_price} 
                    thousandSeparator={true} 
                    decimalScale={2} 
                    decimalSeparator={'.'}
                    fixedDecimalScale={true}
                />                
            </TableCell>
            <TableCell style={{ fontSize : "14px", textTransform : "uppercase" }}>
                {item.item_unit}                 
            </TableCell>
            <TableCell
                align="center"
            >  
                <IconButton
                    variant="contained"                                            
                    size="small"
                    onClick={(e)=>{    
                        history.push('/products/' + item._id);
                    }}                               
                ><FontAwesomeIcon color="green" icon={faPencilAlt} /></IconButton>&nbsp;&nbsp;       
                <ProductBarcodeModal 
                    open={open} 
                    handleClose={handleClose}
                    data={selectedItem}
                />
                {/* <IconButton
                    variant="contained"
                    color="default"
                    size="small"
                    onClick={(e)=>{
                        setSelectedItem(item);
                        handleOpen();
                    }}     
                ><FontAwesomeIcon icon={faBarcode} /></IconButton>&nbsp;&nbsp; */}
                <IconButton
                    variant="contained"
                    color="secondary"
                    size="small" 
                    onClick={(e)=>{
                        history.push('/products/del/' + item._id);
                    }}   
                ><FontAwesomeIcon icon={faTrash} /></IconButton>&nbsp;&nbsp;
            </TableCell>
        </>
    )
}

export default withStyles(Styles)(ListItems)
