const useStyle = {
    AppNav : {
        display : "flex",
        flexDirection : "column",
        padding : "20px",
        width : "300px",
        backgroundColor : "#FFFFFF",
        borderRadius : "20px",
        marginRight: "10px",
        marginBottom : "10px",
        '& a' : {
            textDecoration : "none",
            display : "flex",
            flexWrap : "wrap",
            fontWeight : "700",
            fontSize: "1em",            
            color : "#5B73A0",
            padding : "15px",
            '& svg' : {
                marginRight : "5px",
                fontSize: "1em"
            },
            marginBottom : "5px",
            transition : "all 300ms linear"
        },
        '& a:hover' : {
            backgroundColor : "#EEF5FF",
            borderRadius : "17px",
            color : "#396AFF",
            marginLeft : "5px"
        },
        '& a.active' : {
            backgroundColor : "#EEF5FF",
            color : "#396AFF",
            borderRadius : "17px",
            marginLeft : "5px"
        },
        '& h3' : {
            fontSize : "1.1em",
            color : "#3F51B5",
            margin: "10px 0px",
            marginTop : "10px",
            padding : "10px 0px",
            borderBottom : "2px solid #EBEBF7",
            textTransform : "Uppercase"
        },        
        '& h3:first-child' : {
            backgoundColor : "#3F51B5"
        }
    },
    AppNavItemHover : {
        color : "#5B73A0"
    },
    AppHeader : {
        display: "flex",
        justifyContent : "center",
        padding : "10px",
        height: "50px",        
        backgroundColor : "#FFFFFF",
        color : "#5B73A0",
    },
    MainBar : {
        display : "flex",
        height : "50px",
        justifyContent : "space-between",
        backgroundColor : "white",
        color : "grey",
        zIndex : 200
    },
    titleHead : {
        display : "flex",
        alignItems : "center",
        justifyContent : "flex-start",
        '& h3' : {
            display : "flex",
            flexDirection : "column",
            justifyContent : "center",
            margin : "0px !important"
        },
    },
    MainBarRightBtns : {
        display : "flex",
        justifyContent : "flex-end",        
        padding : "10px 0px",
        '& button' : {
            margin : "0px 10px",
            WebkitAppRegion : "no-drag"
        }
    },
    Loader : {
        top : 0,
        left : 0,
        display : "flex",
        position: "fixed",
        justifyContent : "center",
        alignItems : "center",
        zIndex : 100,
        backgroundColor : "rgba(0, 0, 0, 0.9)",
        height: "100%",
        width : "100%",
        transition : "all 300ms linear"
    },
    SearchModal : {
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        position : "absolute",
        flexDirection : "column",
        width : "420px",
        background : "#ffffff",
        top : "50%",
        left : "50%",
        padding : "20px",
        borderRadius : "10px",
        transform : "translate(-50%,-50%)",
        outline : "none",
        '& input[type=text]' : {
            background : "#ffffff"
        }
    }
}

export default useStyle;