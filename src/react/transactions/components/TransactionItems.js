import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TableCell, TableRow } from '@material-ui/core'
import { Delete } from '@material-ui/icons';
import React from 'react';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router-dom';

function TransactionItems(props) {
    const {data} = props;
    const history = useHistory();
    const formatter = new Intl.NumberFormat('en-PH',{
        style : 'currency',
        currency : 'Php'
    });
    return (
        <>
            <TableRow
                hover
                style={{ cursor : "pointer" }}
                onDoubleClick={()=>{
                    history.push(`/transactions/${data._id}`);
                }}
                title={
                    `Receipt# : ${data._id}\nTransaction Type : ${data.payment_type}\nCart Count : ${data.cart.length}\nPayments : ${data.payments.length > 0 ? data.payments.map(payment=>formatter.format(payment)) : 'Paid'}\nBalance : ${data.payment_type === 'full' ? 0.00 : formatter.format(data.change_amount * -1)}`
                }
                >
                <TableCell style={{ textAlign : "left" }}><FontAwesomeIcon icon={faUser} />&nbsp;&nbsp;{data.customer_name}</TableCell>
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
                        allowNegative={false}
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        displayType="text"
                        fixedDecimalScale={true}
                        value={data.change_amount}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        size="medium"    
                        onClick={()=>{
                            history.push(`/transactions/del/${data._id}`);
                        }}                    
                    >
                        <Delete color="secondary" />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}

export default TransactionItems
