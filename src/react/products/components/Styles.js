const useStyles = {
    AppProd : {
        padding : "10px",
        marginTop : "10px",
        borderRadius : "10px"
    },  
    SingleProdAppBar : {
        
    },
    SingleProdTable : {
        marginTop : "20px",
        overflowY : "scroll",
        minHeight : "350px",
        height : "100%"
    },
    textarea : {
        width : "100%",
        height : '200px',
        resize : false,
        borderColor : "lightgrey"
    },
    Table : {
        position : "relative",
        minHeight : "490px",
        marginTop : "10px",
        '& tr td' : {
            '& :hover' : {
                
            }
        },
        '& th' : {
            fontWeight : "70",
        }
    },
    ProductModal : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        background : "#ffffff",
        position : "absolute",
        flexDirection : "column",
        padding : "50px",
        marginTop : "50px"
    },
    DeleteModal : {        
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "column",
        outline : 0,    
        '& div' : {
            textAlign : "center",
            '& h2' : {
                marginTop : "0px"
            }
        }
    },
    DeleteModalContent : {
        display : "flex",
        alignItems : "center",
        justifyContent : "center",
        padding : "30px",
        background : "#ffffff",
        outline : "none",
        width : "350px",
        height : "auto",
        borderRadius : "10px"
    },
    SingleProdBarcodeTop : {       
        height: "150px",                         
        boxShadow : "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
        display : "flex",
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "center"
    },
    SingleProdBarcodeBottom : {
        display : "flex",
        marginTop : '18px',
        justifyContent : "center",
        alignItems : "center",
        padding : '10px',
        boxShadow : "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
        '& div' : {
            padding : "5px"
        }
    },
    SingleProdTabWrap : {
        display : "flex",
        alignContent : "flex-start",
        alignItems : "flex-start"
    }
};

export default useStyles;