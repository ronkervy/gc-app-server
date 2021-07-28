const useStyles = {
    DeleteModal : {
        display : "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },
    DeleteModalContent : {
        padding : "30px",
        width : "350px",
        heigth : "auto",
        outline : "none",
        backgroundColor : "#FFFFFF"
    },
    InvoiceModal : {
        position : "relative",
        display : "flex",
        flexDirection : "column",
        height : "100%",
        alignItems : "center",
        justifyContent : "center",
        outline : "none",
        padding : "40px"
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
    }
}

export default useStyles;