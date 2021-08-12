const useStyles = {
    DeleteModal : {
        display : "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },
    DeleteModalContent : {
        display : "flex",
        alignItems : "center",
        justifyContent : "center",
        padding : "30px",
        width : "350px",
        height : "auto",
        outline : "none",
        backgroundColor : "#FFFFFF",
        borderRadius : "10px"
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
        '& table' : {
            '& tr td' : {
                fontSize : "1em"
            },
        },
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