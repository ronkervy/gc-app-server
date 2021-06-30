import React, { useState } from 'react';
import { 
    Backdrop,
    Fade, 
    Modal,
    withStyles,
    FormControl,
    TextField,
    InputAdornment
} from '@material-ui/core';
import Styles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';

function SearchModal(props) {

    const { classes,open,handleClose } = props;
    const [search,setSearch] = useState('');
    const history = useHistory();

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}                        
        >            
            <Fade                
                in={open}
            >                   
                <FormControl className={classes.SearchModal}>
                    <TextField
                        fullWidth
                        autoFocus
                        variant="outlined" 
                        size="medium"
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
                                history.push('/products/search/' + search);
                                setSearch('');
                                handleClose();
                            }
                        }}
                        
                        onChange={(e)=>{
                            setSearch(e.target.value);
                        }}
                    />              
                </FormControl>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(SearchModal)
