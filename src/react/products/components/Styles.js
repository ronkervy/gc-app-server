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
        marginTop : "10px",
        '& tr td' : {
            fontSize : ".8em",
            '& :hover' : {
                
            }
        },
        '& th' : {
            fontWeight : "70",
            fontSize : ".8em"
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
        background : "#ffffff",
        display : "flex",
        padding: "50px",
        justifyContent : "center",
        flexDirection : "column",
        alignContent : "flex-start",
        width : "350px",
        height : "auto",
        position : "absolute",
        borderRadius : "30px",
        top : "50%",
        left : "50%",
        transform : "translate(-50%,-50%)",      
        outline : 0,    
        '& div' : {
            textAlign : "center",
            '& h2' : {
                marginTop : "0px"
            }
        }
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