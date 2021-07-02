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
            <TableCell style={{ textTransform : "capitalize" }}>{item.item_name}</TableCell>
            <TableCell>{item.item_qty}</TableCell>
            <TableCell>
                <small>
                    <NumberFormat 
                        displayType="text" 
                        value={item.item_price} 
                        thousandSeparator={true} 
                        prefix={'Php '} 
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}
                    />
                </small>                
            </TableCell>
            <TableCell>
                <small>
                    <NumberFormat 
                        displayType="text" 
                        value={item.item_selling_price} 
                        thousandSeparator={true} 
                        prefix={'Php '} 
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}
                    />    
                </small>                    
            </TableCell>
            <TableCell
                style={{textAlign : "center"}}
            >  
                <IconButton
                    variant="contained"                                            
                    size="small"
                    style={{ fontSize : ".8em !important", color:"#ffffff"}}  
                    onClick={(e)=>{    
                        history.push('/products/' + item._id);
                    }}                               
                ><FontAwesomeIcon color="green" icon={faPencilAlt} /></IconButton>&nbsp;&nbsp;       
                <ProductBarcodeModal 
                    open={open} 
                    handleClose={handleClose}
                    data={selectedItem}
                />
                <IconButton
                    variant="contained"
                    color="default"
                    size="small"
                    style={{ fontSize : ".8em !important"}}   
                    onClick={(e)=>{
                        setSelectedItem(item);
                        handleOpen();
                    }}     
                ><FontAwesomeIcon icon={faBarcode} /></IconButton>&nbsp;&nbsp;
                <IconButton
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ fontSize : ".8em !important"}}     
                    onClick={(e)=>{
                        history.push('/products/del/' + item._id);
                    }}   
                ><FontAwesomeIcon icon={faTrash} /></IconButton>&nbsp;&nbsp;
            </TableCell>
        </>
    )
}

export default withStyles(Styles)(ListItems)
