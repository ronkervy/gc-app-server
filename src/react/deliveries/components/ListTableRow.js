import { faCog, faFilePdf, faPrint, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    TableRow,
    IconButton,
    TableCell,
    Switch,
    Collapse,
    Box,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    Typography,
    FormControlLabel,
    TablePagination,
    Menu,
    MenuItem,
    Grid
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CreateInvoice } from '../../shared/store/InvoiceService';
import { UpdateDeliveryStatus } from '../store/DelServices';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import DocumentDef from '../../components/DocumentDef';

function ListTableRow(props) {

    const dispatch = useDispatch();
    const history = useHistory();
    const { delivery,index } = props;
    const { entities : del } = useSelector(state=>state.deliveries);
    const [open,setOpen] = useState(-1);
    const [elem,setElem] = useState(null);
    const [delivered,setDelivered] = useState(del[index].status);
    const dnow = new Date(delivery.date).toLocaleDateString('en-US',{month : 'numeric',year : 'numeric',day : '2-digit'});
    const [page,setPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(6);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const updateDelivery = ()=>{
        setDelivered(!delivered);
    }

    const handleClick = (i)=>{
        setOpen(open === i ? -1 : i);
    }

    const handlePrint = async (id)=>{
        
    }

    const handleGeneratePdf = async(id)=>{
        const resPDF = await dispatch( CreateInvoice({
            opt : {
                url : '/deliveries/' + id
            }
        }) );

        if( CreateInvoice.fulfilled.match(resPDF) ){  
            pdfMake.vfs = pdfFonts.pdfMake.vfs;          
            const { doc,logo } = resPDF.payload;
            let pdf = JSON.parse(doc);

            const docDef = DocumentDef(pdf,logo);

            const docGenerator = pdfMake.createPdf(docDef);
            docGenerator.getBlob((blob)=>{
                const url = window.URL.createObjectURL(blob);
                history.push(`/deliveries/invoice?pdf=${url}`);
            });
        }
    }

    const handleOpen = (e)=>{
        setElem(e.currentTarget);
    }

    const handleClose = ()=>{
        setElem(null);
    }

    return (
        <>
            <TableRow key={index}>
                <TableCell>
                    <IconButton 
                        size="small"
                        aria-expanded={open === index ? true : false} 
                        aria-label="show more"
                        onClick={()=>{
                            handleClick(index);
                        }}
                    >
                        {open === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell style={{fontSize : "10px",color : "green"}}>{delivery._id}</TableCell>                
                <TableCell style={{textAlign : "center"}}>{delivery.count}</TableCell>
                <TableCell>{dnow}</TableCell>
                <TableCell>
                    <NumberFormat
                        displayType="text"
                        thousandSeparator={true}
                        decimalScale={2}
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}
                        value={delivery.total}
                        prefix="Php "
                    />
                </TableCell>
                <TableCell>   
                    <IconButton
                        size="medium"
                        aria-controls="options" 
                        aria-haspopup="true"
                        onClick={(e)=>{
                            handleOpen(e);
                        }}                              
                    >
                        <FontAwesomeIcon color="grey" icon={faCog} />
                    </IconButton>
                    <Menu
                        id="options"
                        anchorEl={elem}
                        keepMounted
                        open={Boolean(elem)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={(e)=>{
                                handleGeneratePdf(delivery._id);                                
                                handleClose();
                            }}
                        >
                            <FontAwesomeIcon color="red" icon={faFilePdf} />&nbsp;&nbsp;Generate PDF file
                        </MenuItem>
                        <MenuItem
                            onClick={(e)=>{
                                handlePrint(delivery._id);
                                handleClose();
                            }}
                        >
                            <FontAwesomeIcon color="green" icon={faPrint} />&nbsp;&nbsp;Print Order
                        </MenuItem>
                    </Menu>                                                  
                </TableCell>
                <TableCell style={{
                    textAlign : "center"
                }}>
                    <Typography variant="caption"
                        style={ 
                            !del[index].status ? { color : 'red',fontWeight : '600' } : { color : 'green',fontWeight : '600' } }
                    >
                        {!del[index].status ? 'Not Delivered' : 'Delivered'}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse 
                        in={open === index}
                        timeout="auto" 
                        unmountOnExit
                        component={Grid}
                    >
                        <Box margin={2}>
                            <Typography variant="h6" gutterBottom component="div">
                                Ordered Items
                            </Typography>
                            <TableContainer elevation={3} component={Paper}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2}>Name</TableCell>
                                            <TableCell style={{
                                                textAlign : "center"
                                            }}>QTY</TableCell>
                                            <TableCell align="right" style={{
                                                textAlign : "center"
                                            }}>Price</TableCell>
                                            <TableCell
                                                align="right"
                                                style={{
                                                    textAlign : "center"
                                                }}
                                            >Supplier</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {delivery.products.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((val,i)=>(
                                        <TableRow key={i}>
                                            <TableCell colSpan={2}>{val.item}</TableCell>
                                            <TableCell style={{
                                                textAlign : "center"
                                            }}>{val.qty}</TableCell>
                                            <TableCell align="right" style={{
                                                textAlign : "center"
                                            }}>
                                                <NumberFormat
                                                    displayType="text"
                                                    thousandSeparator={true}
                                                    decimalScale={2}
                                                    decimalSeparator={'.'}
                                                    fixedDecimalScale={true}
                                                    value={val.total}
                                                    prefix="Php "
                                                />
                                            </TableCell>
                                            <TableCell
                                                colSpan={2}
                                                style={{
                                                    textAlign : "center"
                                                }}
                                                align="right"
                                            >
                                                {val.supplier}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TablePagination
                                            component={TableCell}
                                            rowsPerPageOptions={[6, 12, 120]}
                                            count={delivery.products.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            labelRowsPerPage={false}
                                            colSpan={2}
                                        />
                                        <TableCell>
                                            <IconButton
                                                size="medium"
                                                onClick={()=>{
                                                    history.push('/deliveries/del/' + delivery._id);
                                                }}
                                            >
                                                <FontAwesomeIcon size="sm" color="red" icon={faTrashAlt} />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell style={{
                                            textAlign : "right"
                                        }}>
                                            <FormControlLabel 
                                                control={
                                                    <Switch 
                                                        name="checked" 
                                                        color="primary"
                                                        checked={delivered}
                                                        onClick={(e)=>{
                                                            updateDelivery();
                                                            setTimeout(()=>{
                                                                dispatch( UpdateDeliveryStatus({
                                                                    opt : {
                                                                        url : '/deliveries/' + delivery._id
                                                                    },
                                                                    values : {
                                                                        delivery,
                                                                        status : !delivered                                                              
                                                                    }
                                                                }) ); 
                                                            },500);                                                 
                                                        }}                                       
                                                    />
                                                }
                                                label="Status"                                                
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>                
            </TableRow>
        </>
    )
}

export default ListTableRow
