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
        padding : "40px",
        backgroundColor : "#EBEBF7"
    },
    Table : {
        position : "relative",
        '& table' : {
            '& tr td' : {
                fontSize : ".9rem"
            },
        },
        '& tr td' : {
            fontSize : ".9rem",
        },
        '& th' : {
            fontWeight : "70",
            fontSize : ".9rem"
        },
        '@media only screen and (max-width : 1366px)' : {
            height : "auto"
        },     
    }
}

export default useStyles;