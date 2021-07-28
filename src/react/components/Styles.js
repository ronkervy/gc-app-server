const useStyles = {
    HomeWrap : {
        display : "flex",
        alignItems : "center",
        justifyContent : "space-between",
        '@media only screen and (min-width : 1300px)' : {
            justifyContent : "center"
        },
        '@media only screen and (max-width : 1024px)' : {
            justifyContent : "center"
        }
    },
    boxOverview : {
        display : "flex",
        justifyContent : "space-between",
        alignItems : "center",
        flexBasis : "160px",
        height : "100px",
        padding : "35px",
        margin : "10px",
        background : "#FFFFFF",
        borderRadius : "10px",
        cursor : "pointer",
        '@media only screen and (min-width : 1300px)' : {
            flexBasis: "200px !important",
            
        },
        '@media only screen and (max-width : 1024px)' : {
            flexBasis: "160px !important"
        },
        headTitle : {
            
        }
    },
    boxCurrentBal : {
        display : "flex",
        justifyContent : "space-between",
        alignItems : "center",
        height: "150px",
        borderRadius : "10px",
        padding: "35px"
    },
    boxSummary : {
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-between",
        alignItems : "center",
        height : "330px",
        borderRadius : "10px",
        padding: "25px"
    },
    barcodeWrap : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        position : "absolute",
        flexDirection : "column",
        top : "50%",
        left : "50%",
        transform : "translate(-50%,-50%)",
        backgroundColor : "#ffffff",
        width : "350px",
        maxWidth : "350px",
        height : "auto",
        borderRadius : "30px",
        '& h2,h3,h4' : {
            margin : "0px"
        },
        padding: "50px"
    }
}

export default useStyles;