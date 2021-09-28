const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

export default (docs,logoURL)=>{

    let priceArr = [];
    let from;
    let to;

    docs.map(itms=>{
        priceArr.push(itms[5].price);
        from = itms[5].from;
        to = itms[5].to;
    });    

    let totalPriceArr = priceArr.reduce((a,b)=>a+b,0);
    let transactionCount = priceArr.length;

    return {
        pageSize : 'A4',
        pageMargins: [ 40, 60, 40, 30 ],
        compress : false,
        header : (currentPage)=>{
            if( currentPage === 1 ){
                return [
                    {
                        columns : [
                            {
                                image : `data:image/png;base64,${logoURL}`,
                                width : 40,
                                height : 40,
                                margin : [26,5]
                            },
                            {
                                stack : [
                                    {
                                        text : 'Gloriocity \n',
                                        style : 'header'
                                    },
                                    {
                                        text : 'Construction Supply',
                                        style : 'subheader'
                                    }
                                ],
                                margin : [20,12]
                            },
                            {
                                stack : [
                                    {
                                        text : '4024 Old National Highway'
                                    },
                                    {
                                        text : 'Brgy. San Antonio Biñan, Laguna',
                                    },{
                                        text : 'Calabarzon, Philippines'
                                    }
                                ],
                                alignment : 'right',
                                margin : [30,12],
                                fontSize : 8             
                            }      
                        ],
                        margin : [10,8],
                        width : '*',
                    }
                ]
            }
        },
        footer : ( currentPage, pageCount )=>{ 
            return {
                text : 'Page ' + currentPage.toString() + ' of ' + pageCount,
                alignment : "center",
                fontSize : 10
            }; 
        },
        content: [
            {
                text : [
                    {text : 
                        "SALES REPORT",
                        style : {
                            alignment : "center",
                            bold : true,
                            fontSize : 18
                        }
                    },
                ], 
            },            
            {                             
                table : {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: ['*','*'],
                    body: [                         
                        [
                            { text : [
                                    "Date Generated : ",
                                    {
                                        text : `${new Date(Date.now()).toLocaleDateString()}`,
                                        style : {
                                            italics : true,
                                            bold : true,
                                            alignment : "right"
                                        } 
                                    },
                              ],
                              style : { 
                                bold: true, 
                                fontSize : 10
                              } 
                            },
                            { text : [
                                    `Total Sales : `, 
                                    { 
                                        text : formatter.format(totalPriceArr), 
                                        style : {
                                            alignment : "right"
                                        }
                                    }
                              ],
                              style : { 
                                bold: true,
                                fontSize : 10
                              } 
                            }
                        ],                 
                        [
                            { text : [
                                "From : ",
                                    {
                                        text :
                                        `${from}`,
                                        style : {
                                            fontSize : 8,                                            
                                            alignment : 'right',
                                            bold : true,                                            
                                        },
                                        border : [true,true,true,true],
                                    },
                                    {
                                        text : [
                                            " To : ",
                                            {
                                                text : `${to}`,
                                                style : {
                                                    fontSize : 8,                                            
                                                    alignment : 'right',
                                                    bold : true,                                                    
                                                },
                                                border : [true,true,true,true],
                                            }
                                        ]
                                    }                                                             
                                ],
                                style : {
                                    fontSize : 11,
                                    bold : true                              
                                },
                                border : [true,true,true,true],
                            },
                            { text : 
                                [
                                    "Transactions Count : ", 
                                    { text : 
                                        `${transactionCount}`,
                                        style : {
                                            fontSize : 10,
                                            alignment : 'right',
                                            bold : true
                                        }
                                    }
                                ],
                                style : {
                                    fontSize : 11,
                                    bold : true                                 
                                },
                                border : [true,true,true,true]
                            }
                        ],
                    ]
                },
                margin : [0,10,0,0]
            },
            {
                layout: {
                    hLineWidth : (i,node)=>{
                        return (i === 0 || i === node.table.body.length) ? 1 : 0;
                    },
                    hLineHeight : (i,node)=>{
                        return (i === 1) ? 0 : 1;
                    },
                    paddingBottom: (i, node, colIndex) => {
                        const DEFAULT_PADDING = 2;
                        // Calculate padding for the last element of the table.
                        if (i === node.table.body.length - 1) {
                            const currentPosition = node.positions[node.positions.length - 1];
                            const totalPageHeight = currentPosition.pageInnerHeight;
                            const currentHeight = currentPosition.top;
                            const paddingBottom = totalPageHeight - currentHeight;
                            return paddingBottom;
                        } else {
                            return DEFAULT_PADDING;
                        }
                    },
                }, // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    dontBreakRows : true,
                    headerRows: 1,
                    widths: [ 110, 120, '*', '*','*','*'],
                    body: [                        
                        [
                            {
                                text : 'Name',
                                style : 'tableHeader',
                                border : [true,true,true,true]
                            }, 
                            {
                                text : 'Receipt Number',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Date',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Payment',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Balance',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Total',
                                style : 'tableHeader'
                            }
                        ],
                        ...docs
                    ]
                },
                margin : [0,5,0,0]
            }
        ],
        styles : {
            header : {
                bold : true,
            },
            subheader : {
                fontSize : 9
            },
            tableHeader : {
                fontSize : 9,
                bold : true,
                alignment : 'center',
                margin : [0,5],                
            },
            tableItems : {
                alignment : 'center',
                margin : [0,5],
                fontSize : 9
            },
            trans_id : {
                fontSize : 6,
                color : "green"
            }
        },
        defaultStyle : {
            font : 'Arial',
            columnGap : 5
        }
    }
}