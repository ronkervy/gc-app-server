import pdfmake from 'pdfmake/build/pdfmake';
const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

pdfmake.fonts = {
    Courier : {
        normal: 'cour.ttf',
        bold: 'courbd.ttf',
        italics: 'couri.ttf',
        bolditalics: 'courbi.ttf'
    },
    Times: {
        normal: 'times.ttf',
        bold: 'timesbd.ttf',
        italics: 'timesi.ttf',
        bolditalics: 'timesbi.ttf'
    },
    Arial : {
        normal: 'arial.ttf',
        bold: 'arialbd.ttf',
        italics: 'ariali.ttf',
        bolditalics: 'arialbi.ttf'
    },
    // Roboto: {
    //     normal: 'Roboto-Regular.ttf',
    //     bold: 'Roboto-Medium.ttf',
    //     italics: 'Roboto-Italic.ttf',
    //     bolditalics: 'Roboto-MediumItalic.ttf'
    // },
    Epson: {
        normal: 'Epson1.ttf',
        bold: 'Epson1.ttf',
        italics: 'Epson1.ttf',
        bolditalics: 'Epson1.ttf'
    },
    Charlie_dotted : {
        normal : 'charlie_dotted.ttf',
        bold : 'charlie_dotted.ttf',
        italics : 'charlie_dotted.ttf',
        bolditalics : 'charlie_dotted.ttf'
    },
    DOT_MATRIX : {
        normal : 'DOTMATRI.TTF',
        bold : 'DOTMBold.TTF',
        italics : 'DOTMATRI.TTF',
        bolditalics : 'DOTMATRI.TTF'
    },
    FAKE_RECEIPT : {
        normal : 'fake receipt.ttf',
        bold : 'fake receipt.ttf',
        italics : 'fake receipt.ttf',
        bolditalics : 'fake receipt.ttf'
    }
}

export default (docs,logoURL)=>{
    let discountArr = [];
    let customer_name,
        customer_address,
        transaction_date,
        transaction_type,
        total_amount,
        change_amount,
        cash_amount,
        _id
    ;

    docs.map((doc,i)=>{     
        let less = ( doc[4].discount * doc[4].price);
        customer_name = doc[4].customer_name;
        transaction_date = new Date(doc[4].date).toLocaleDateString();
        transaction_type = doc[4].transact_type;
        total_amount = doc[4].total_amount;
        change_amount = doc[4].change_amount;
        cash_amount = doc[4].cash_amount;
        _id = doc[4]._id;
        customer_address = doc[4].customer_address;
        discountArr.push(less);
    });

    let discount = discountArr.reduce((a,b)=>a+b,0);

    const alterConfig = (configs,cb)=>{
        const newConfig = {
            ...configs
        };

        return newConfig;
    }

    const configs = {
        pageSize : {
            width : 100 * 8,
            height : 100 * 5.5
        },
        header : {},
        footer : (currentPage,pageCount)=>{
            if( currentPage == pageCount ){
                return {
                    id : 'footer',                                 
                    text : "Received goods in order and prestine condition\nBy:__________________________________",                            
                    style : {
                        fontSize : 12,                         
                    },
                    alignment : "right",
                    bold : false,     
                    margin : [10,0]                 
                }
            }
        },
        pageMargins : [10,30,10,60],
        compress : false,        
        content : [
            {
                columns : [
                    { 
                        text : [
                            "ORDER SLIP\n",
                            {
                                text : `Smart/Tnt : 0963-644-8252\nGlobe : 0926-775-3578`,
                                alignment : "center",
                                style : 'subheader'
                            }
                        ], 
                        bold : true,
                        fontSize : 25,
                        //color : "#808080",
                        font : "Times"  
                    }
                ],
                alignment : "center",
                margin : [0,0,0,10]
            },
            {                
                stack : [
                    {
                        columns : [
                            {
                                text : [
                                    'Customer Name : ',
                                    {
                                        text : `${customer_name}`,
                                        italics : false,
                                        bold : false
                                    }
                                ],       
                                bold : true,                         
                                fontSize : 16,
                                margin : [0,5,0,0]
                            },
                            {
                                text : [
                                    'Transaction Date : ',
                                    {
                                        text : `${transaction_date}`,
                                        italics : false,
                                        bold : false
                                    }
                                ],
                                bold : true,
                                fontSize : 16,
                                margin : [0,5,0,0]
                            },
                        ],
                        
                    },
                    {
                        columns : [                            
                            {
                                text : [
                                    `Address : `,
                                    {
                                        text : `${customer_address}`,
                                        bold : false
                                    }
                                ],
                                bold : true,
                                fontSize : 16,
                                margin : [0,5,0,10]
                            },
                            {
                                text : [
                                    'Receipt# : ',
                                    {
                                        text : `${_id}`,
                                        fontSize : 16,
                                        bold : false
                                    }
                                ],                         
                                bold : true,
                                fontSize : 16,
                                margin : [0,5,0,10]
                            },
                        ]
                    },
                    {
                        id : 'table-headers',
                        table : {              
                            headerRows : 1,  
                            widths: [ 60,60,'*', 120,80],
                            body: [
                                [                                     
                                    {
                                        text : 'QTY',
                                        style : 'tableHeader',
                                        border : [true,true,true,false]
                                    },
                                    {
                                        text : 'UNIT',
                                        style : 'tableHeader',
                                        border : [true,true,true,false]
                                    },
                                    {
                                        text : 'ITEM NAME',
                                        style : 'tableHeader',
                                        border : [true,true,true,false]
                                    },
                                    {
                                        text : 'UNIT PRICE',
                                        style : 'tableHeader',
                                        border : [true,true,true,false]
                                    },
                                    {
                                        text : 'AMOUNT',
                                        style : 'tableHeader',
                                        border : [true,true,true,false]
                                    },                                   
                                ]                                                   
                            ]
                        }
                    },
                    {   
                        id : 'table-items',
                        layout : {
                            hLineWidth : (i,node)=>{
                                return (i === 0 || i === node.table.body.length) ? 1 : 0;
                            },
                            hLineHeight : (i,node)=>{
                                return (i === 1) ? 0 : 1;
                            },
                            // paddingBottom: (i, node) => {                      
                            //     if( node.positions[node.positions.length - 1] === undefined ) return;
                            //     if( node.table.body.length - 1 === NaN ) return;
                            //     const DEFAULT_PADDING = 2;
                            //     // Calculate padding for the last element of the table.
                            //     const currentPosition = node.positions[node.positions.length - 1];                                    
                            //     const totalPageHeight = currentPosition.pageInnerHeight;
                            //     const currentHeight = currentPosition.top;
                            //     const paddingBottom = totalPageHeight - currentHeight;  

                            //     if( (node.table.body.length - 1) >= 5 ){
                            //         if (i === node.table.body.length - 1 ) {                                            
                            //             return paddingBottom;                                                                                                    
                            //         }else{
                            //             return DEFAULT_PADDING;
                            //         }
                            //     }else{
                            //         return DEFAULT_PADDING;
                            //     }

                            // }
                        },
                        table : {    
                            dontBreakRows: false,
                            widths: [ 60,60,'*', 120,80],
                            body : [...docs]                 
                        }                        
                    },                    
                    {
                        stack : [
                            {
                                table : {
                                    widths : ['*',190,250],
                                    headerRows : 1,
                                    body : [
                                        [
                                            {
                                                text : "Prepared by : ",
                                                style : {
                                                    fontSize : 14
                                                },
                                                bold : true
                                            },
                                            {
                                                text : `Discount : ${formatter.format(discount)}`,
                                                style : {
                                                    fontSize : 14,
                                                    font : 'Times'
                                                },
                                                bold : false
                                            },
                                            {
                                                text : `Amount to pay : ${formatter.format(total_amount)}`,
                                                style : {
                                                    fontSize : 14,
                                                    font : 'Times'
                                                },
                                                bold : false
                                            }
                                        ],
                                        [ 
                                            { 
                                                text : "", 
                                                border : [false,false,false,false],
                                            },
                                            {
                                                text : [
                                                    `Cash : `,
                                                    { 
                                                        text : `${cash_amount}`,
                                                        style : { 
                                                            alignment : "center", 
                                                            font : "Times",
                                                            fontSize : 14
                                                        } 
                                                    }
                                                ],
                                                bold : false,
                                                fontSize : 14
                                            }, 
                                            { 
                                                text : `${change_amount <= -1 ? 'Balance : ' + formatter.format(change_amount * -1) : 'Change : ' + formatter.format(change_amount)}`,
                                                style : {
                                                    font : 'Times',
                                                    fontSize : 14
                                                },
                                                bold : false
                                            }
                                        ]
                                    ]                        
                                },
                                margin: [0,5,0,0]
                            },
                            {
                                text : "**** Nothing Follows ****",                            
                                style : {
                                    fontSize : 14,        
                                    //color : "#808080"                     
                                },
                                bold : false,
                                alignment : "center",
                                margin : [0,7,0,0]
                            }
                        ]                        
                    }                
                ],                
                margin : [0,10,0,0]
            }
        ],
        styles : {
            header : {
                // bold : true,
                //color : "#808080"
                fontSize : 15,
                font : "Times",
                bold : true
            },
            subheader : {
                fontSize : 13,
                // bold : true,
                font : "Times",
                bold : true
            },
            tableHeader : {
                fontSize : 15,
                alignment : 'center',
                margin : [0,3],  
                bold : true,
                border : [true,true,true,true]      
            },
            tableItems : {
                alignment : 'center',
                margin : [0,3],
                fontSize : 14,
                //color : "#808080"
            },
            tableItemsAmount : {
                alignment : 'center',
                margin : [0,2],
                fontSize : 14,
                font : "Times",
            }
        },
        defaultStyle : {
            font : 'Times',
            columnGap : 5,
            fontSize : 14,
            color : [70,50,30,100]
        }
    }

    return alterConfig(configs,(currentPage,newConfig)=>{
        if( currentPage > 1 ){
            return newConfig.pageMargins[3] = 40;
        }      
        console.log(newConfig.pageMargins);
    });
}