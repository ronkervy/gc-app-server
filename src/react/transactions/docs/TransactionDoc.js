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

    docs.map(doc=>{
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

    return {
        pageSize : {
            width : 120 * 9.5,
            height : 120 * 5.5
        },
        pageMargins: [ 20, 80, 20, 120 ],
        compress : false,
        header : (currentPage)=>{
            if( currentPage === 1 ){
                return {
                    columns : [
                        {
                            image : `data:image/png;base64,${logoURL}`,
                            width : 60,
                            height : 60,
                            margin : [2,5,0,0]
                        },
                        {
                            stack : [
                                {
                                    text : 'Smart/Tnt:0963-644-8252\nGlobe/tm:0926-775-3578',
                                    //color : "#808080"
                                    style : 'subheader'
                                }
                            ],
                            alignment : 'right',
                            margin : [2,12]      
                        }   
                    ],
                    margin : [20,8],
                    width : '*',
                }
            }
        },
        footer : (currentPage,pageCount)=>{
            if( currentPage === pageCount ){
                return {
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
                                                fontSize : 15
                                            },
                                            bold : true
                                        },
                                        {
                                            text : `Discount : ${formatter.format(discount)}`,
                                            style : {
                                                fontSize : 15,
                                                font : 'Arial'
                                            },
                                            bold : true
                                        },
                                        {
                                            text : `Amount to pay : ${formatter.format(total_amount)}`,
                                            style : {
                                                fontSize : 15,
                                                font : 'Arial'
                                            },
                                            bold : true
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
                                                        font : "Arial",
                                                        fontSize : 15
                                                    } 
                                                }
                                            ],
                                            bold : true,
                                            fontSize : 15
                                        }, 
                                        { 
                                            text : `Change : ${change_amount}`,
                                            style : {
                                                font : 'Arial',
                                                fontSize : 15
                                            },
                                            bold : true
                                        } 
                                    ]
                                ]                        
                            }
                        },
                        {
                            text : "**** Nothing Follows ****",                            
                            style : {
                                fontSize : 12,        
                                //color : "#808080"                     
                            },
                            bold : true,
                            alignment : "center",
                            margin : [0,7,0,0]
                        },
                        {
                            text : "Received goods in order and prestine condition\n\nby:__________________________________",                            
                            style : {
                                fontSize : 12,                         
                            },
                            alignment : "right",
                            bold : true,
                            margin : [0,3,0,0]
                        }
                    ],                    
                    margin : [20,0]                 
                }
            }
        },
        content : [
            {
                columns : [
                    { 
                        text : "ORDER SLIP", 
                        bold : true,
                        style : 
                        { 
                            fontSize : 22,
                            //color : "#808080",
                            font : "Arial"                            
                        } 
                    }
                ],
                alignment : "center"
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
                                        bold : true
                                    }
                                ],       
                                bold : true,                         
                                fontSize : 15,
                                margin : [0,5,0,0]
                            },
                            {
                                text : [
                                    'Transaction Date : ',
                                    {
                                        text : `${transaction_date}`,
                                        italics : false,
                                        bold : true
                                    }
                                ],
                                bold : true,
                                fontSize : 15,
                                margin : [0,5,0,0]
                            },
                        ],
                        
                    },
                    {
                        columns : [                            
                            {
                                text : `Address : ${customer_address}`,
                                bold : true,
                                fontSize : 15,
                                margin : [0,5,0,10]
                            },
                            {
                                text : [
                                    'Receipt# : ',
                                    {
                                        text : `${_id}`,
                                        fontSize : 15
                                    }
                                ],                         
                                bold : true,
                                fontSize : 15,
                                margin : [0,5,0,10]
                            }
                        ]
                    },
                    {
                        table : {
                            dontBreakRows : true,
                            headerRows: 1,
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
                        layout : {
                            hLineWidth : (i,node)=>{
                                return (i === 0 || i === node.table.body.length) ? 1 : 0;
                            },
                            hLineHeight : (i,node)=>{
                                return (i === 1) ? 0 : 1;
                            },
                            paddingBottom: (i, node, colIndex) => {                                
                                const DEFAULT_PADDING = 2;
                                // Calculate padding for the last element of the table.
                                if (i === node.table.body.length - 1 && node.positions[node.positions.length - 1] !== undefined) {
                                    const currentPosition = node.positions[node.positions.length - 1];                                    
                                    const totalPageHeight = currentPosition.pageInnerHeight;
                                    const currentHeight = currentPosition.top;
                                    const paddingBottom = totalPageHeight - currentHeight;                                    
                                    
                                    if( paddingBottom < 0 ){
                                        return DEFAULT_PADDING;
                                    }else{
                                        return paddingBottom;
                                    }                                    
                                } else {
                                    return DEFAULT_PADDING;
                                }
                            }
                        },
                        table : {
                            dontBreakRows : true,
                            headerRows: 1,
                            widths: [ 60,60,'*', 120,80],
                            body: [                                   
                                ...docs                                                      
                            ]
                        }
                    }                    
                ],                
                margin : [0,10,0,0]
            }
        ],
        styles : {
            header : {
                // bold : true,
                //color : "#808080"
                fontSize : 12,
                font : "Arial",
                bold : true
            },
            subheader : {
                fontSize : 12,
                // bold : true,
                font : "Arial",
                bold : true
            },
            tableHeader : {
                fontSize : 16,
                alignment : 'center',
                margin : [0,3],  
                bold : true,
                border : [true,true,true,true]      
            },
            tableItems : {
                alignment : 'center',
                margin : [0,2],
                fontSize : 13,
                //color : "#808080"
            },
            tableItemsAmount : {
                alignment : 'center',
                margin : [0,2],
                fontSize : 13,
                font : "Arial",
            }
        },
        defaultStyle : {
            font : 'Times',
            columnGap : 5,
            //color : "#808080",
            fontSize : 12
        }
    }
}