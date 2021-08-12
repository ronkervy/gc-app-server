import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, IconButton, TableCell, TableRow, withStyles } from '@material-ui/core'
import React from 'react';
import { useHistory } from 'react-router-dom';
import Styles from './Styles';

function SuppTableItems(props) {
    const { items,rowsPerPage,page } = props;
    const history = useHistory();
    return(
        <>
            {items.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map(item=>{
                return (
                    <TableRow key={item._id}>
                        <TableCell style={{color : "green"}}>{item.supplier_id}</TableCell>
                        <TableCell>{item.supplier_name}</TableCell>
                        <TableCell>{item.supplier_email}</TableCell>
                        <TableCell>{item.supplier_contact}</TableCell>
                        <TableCell
                            align="center"
                        >
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={()=>{
                                    history.push(`/supplier/del/${item._id}`);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                )
            })}
        </>
    )
}

export default withStyles(Styles)(SuppTableItems)
