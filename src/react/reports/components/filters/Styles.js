import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
    TransactionModal : {
        position : "relative",
        display : "flex",
        flexDirection : "column",
        alignItems : "center",
        justifyContent : "center",
        outline : "none",
        padding : "40px",
        background : "white"
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width : "400px",
        padding: "50px",
        borderRadius : "8px"
    }
}));

export default useStyles;