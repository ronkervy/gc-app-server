import React, { useState } from 'react';
import { 
    Backdrop,
    Fade, 
    Modal,
    withStyles,
    FormControl,
    TextField,
    InputAdornment,
    Radio,
    FormControlLabel,
    Grid,
    RadioGroup
} from '@material-ui/core';
import Styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';

function SearchModal(props) {

    const { classes,open,handleClose } = props;
    const { entities : products } = useSelector(state=>state.products);
    const [search,setSearch] = useState('');
    const [filter,setFilter] = useState('products');
    const history = useHistory();
    

    const handleChange = (e)=>{
        setFilter(e.target.value);
    }

    const productsAutoComplete = ()=>{
        const arrProducts = [...new Set(products.map(product=>product.item_name))];
        return arrProducts;
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
            className={classes.SearchModal}                        
        >            
            <Fade                
                in={open}
            >                   
                <FormControl 
                    component={Grid}
                    container
                    spacing={2}
                    className={classes.SearchModalContent}
                >
                    <Grid item lg={12} xl={12} sm={12}>                        
                        <Autocomplete 
                            disablePortal
                            options={productsAutoComplete()}
                            inputValue={search}
                            onChange={(e,value)=>setSearch(value)}
                            size="small"
                            renderInput={(params)=>(
                                <TextField
                                    fullWidth
                                    autoFocus
                                    variant="outlined" 
                                    size="small"
                                    label="Search"
                                    value={search}
                                    
                                    InputProps={{
                                        startAdornment : (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </InputAdornment>
                                        )
                                    }}
                                    
                                    onKeyPress={(e)=>{                            
                                        if(e.key === 'Enter'){
                                            if( search === '' ) return handleClose();                                    
                                            history.push(`/search/products?search=${search}&model=${filter}`);
                                            setSearch('');
                                            handleClose();
                                        }
                                    }}
                                    
                                    onChange={(e)=>{
                                        setSearch(e.target.value);
                                    }}
                                    {...params}
                                />
                            )}
                        />
                    </Grid>
                    <RadioGroup 
                        row={true}
                        name="filter" 
                        value={filter} 
                        onChange={handleChange}                         
                    >
                        <Grid item lg={6} xl={6} sm={6}>
                            <FormControlLabel                                
                                value="products" 
                                control={
                                    <Radio color="primary" /> 
                                }
                                label="Products"
                            />                         
                        </Grid>
                        <Grid item lg={6} xl={6} sm={6}>
                            <FormControlLabel 
                                value="transactions"
                                control={
                                    <Radio color="primary" /> 
                                }
                                label="Transactions"
                            />
                        </Grid>
                    </RadioGroup>                                    
                </FormControl>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(SearchModal)
