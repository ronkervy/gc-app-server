import { TableCell, TableRow } from '@material-ui/core'
import React from 'react';
import NumberFormat from 'react-number-format';

function TransactionItems(props) {
    const {key,data} = props;
    console.log(data);
    return (
        <>
            <TableRow
                key={key}
                hover
            >
                <TableCell style={{ textAlign : "center" }}>{data.customer_name}</TableCell>
                <TableCell style={{ textAlign : "center" }}>
                    {data.transaction_date.split('T')[0]}
                </TableCell>
                <TableCell style={{ textAlign : "center" }}>{data.payment_type}</TableCell>
                <TableCell style={{ textAlign : "center" }}>
                    <NumberFormat 
                        thousandSeparator={true} 
                        prefix={'Php '} 
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        displayType="text"
                        fixedDecimalScale={true}
                        value={data.cash_amount}
                    />
                </TableCell>
                <TableCell style={{ textAlign : "center" }}>
                    <NumberFormat 
                        thousandSeparator={true} 
                        prefix={'Php '} 
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        displayType="text"
                        fixedDecimalScale={true}
                        value={data.total_price}
                    />
                </TableCell>
                <TableCell style={{ textAlign : "center" }}>
                    <NumberFormat 
                        thousandSeparator={true} 
                        prefix={'Php '} 
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        displayType="text"
                        fixedDecimalScale={true}
                        value={data.change_amount}
                    />
                </TableCell>
            </TableRow>
        </>
    )
}

export default TransactionItems
