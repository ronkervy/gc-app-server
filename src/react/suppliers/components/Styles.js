const useStyles = {
    AddSupplierWrap : {
        display: "flex",
        justifyContent : "center",
        alignItems : "center",
        padding : "20px",
        height : "100%"
    },
    DeleteModal : {
        display: "flex",
        justifyContent : "center",
        alignItems : "center",
    },
    DeleteModalContent : {
        backgroundColor : "#ffffff",
        display: "flex",
        padding: "30px",
        outline : "none",
        width : "350px",
        heigth : "auto",
        justifyContent : "center",
        alignItems : "center",
        borderRadius : "10px"
    },
    Table : {
        position : "relative",
        minHeight : "490px",
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
    }
}

export default useStyles;