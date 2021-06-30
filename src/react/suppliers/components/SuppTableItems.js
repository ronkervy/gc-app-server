import { TableCell, TableRow, withStyles } from '@material-ui/core'
import React from 'react';
import Styles from './Styles';

function SuppTableItems(props) {
    const { items,rowsPerPage,page } = props;
    return(
        <>
            {items.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map(item=>{
                return (
                    <TableRow key={item._id}>
                        <TableCell style={{color : "green"}}>{item.supplier_id}</TableCell>
                        <TableCell>{item.supplier_name}</TableCell>
                        <TableCell>{item.supplier_email}</TableCell>
                        <TableCell>{item.supplier_contact}</TableCell>
                    </TableRow>
                )
            })}
        </>
    )
}

export default withStyles(Styles)(SuppTableItems)
