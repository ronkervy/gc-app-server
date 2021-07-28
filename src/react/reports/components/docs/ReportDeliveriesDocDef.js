const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

export default (docs,logoURL,prods)=>{

    let from = '';
    let to = '';
    let arrTotal = [];

    docs.map(doc=>{
        from = doc[5].from;
        to = doc[5].to;
        arrTotal.push(doc[5].total);
    });

    const total = formatter.format(arrTotal.reduce((a,b)=>a+b,0));

    return {
        pageSize : 'A4',
        pageMargins: [ 40, 80, 40, 60 ],
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
            if( currentPage === pageCount ){
                return {
                    columns : [
                        {
                            text : "************** Nothing Follows **************",                            
                            style : {
                                alignment : 'center',
                                italics : true,
                                color : "maroon",
                                fontSize : 10
                            }
                        }
                    ]
                }
            }
        },
        content: [
            {
                text : [
                    {text : 
                        "DELIVERY REPORT",
                        style : {
                            alignment : "center",
                            bold : true,
                            fontSize : 18
                        }
                    },
                ], 
                margin : [0,0,0,20]
            },
            {
                table : {
                    headerRows : 1,
                    widths : ['*','*','*'],
                    body : [
                        [
                            { 
                                text : `From Date : ${from}`, 
                                style : {
                                    alignment : 'center',
                                    fontSize : 9
                                }
                            },
                            { 
                                text : `To Date : ${to}`, 
                                style : {
                                    alignment : 'center',
                                    fontSize : 9
                                }
                            },
                            {
                                text : `Total Expense : ${total}`, 
                                style : {
                                    alignment : 'center',
                                    fontSize : 9
                                }
                            },
                        ]
                    ]
                }
            },           
            docs.map((doc,i)=>{
                return {
                    stack : [
                        {
                            layouts : 'lightHorizontalLines',
                            table: {
                                // headers are automatically repeated if the table spans over multiple pages
                                // you can declare how many rows should be treated as headers
                                headerRows: 1,
                                widths: [ 120, '*', '*', '*','*','*'],
                                body: [                        
                                    [
                                        {
                                            text : 'Receipt Number',
                                            style : 'tableHeader'
                                        }, 
                                        {
                                            text : 'Date Ordered',
                                            style : 'tableHeader'
                                        },
                                        {
                                            text : 'Date Delivered',
                                            style : 'tableHeader'
                                        },
                                        {
                                            text : 'Delivery Status',
                                            style : 'tableHeader'
                                        },
                                        {
                                            text : 'Item number',
                                            style : 'tableHeader'
                                        },
                                        {
                                            text : 'Total amount',
                                            style : 'tableHeader'
                                        }
                                    ],
                                    doc
                                ]
                            }                                                                          
                        },
                        {
                            layout: {
                                hLineWidth : (i,node)=>{
                                    return (i === 0 || i === node.table.body.length) ? 1 : 0;
                                },
                                hLineHeight : (i,node)=>{
                                    return (i === 1) ? 0 : 1;
                                }
                            }, // optional
                            table : {
                                headerRows: 1,
                                widths: ['*','*','*'],
                                body : [
                                    [
                                        { text : 'Product Name', style : 'tableHeader'  },
                                        { text : 'QTY', style : 'tableHeader'  },
                                        { text : 'Per unit Total Amount', style : 'tableHeader'  },                            
                                    ],
                                    ...doc[5].prods.map(prod=>{
                                        return [
                                            {text : prod.item_name, style : 'tableItems'},  
                                            {text : prod.qty, style : 'tableItems'},
                                            {text : formatter.format(prod.total), style : 'tableItems'},
                                        ]
                                    })
                                ]
                            }
                        }
                    ],                                                         
                    margin : [0,10,0,0]
                }
            })    
        ],
        styles : {
            header : {
                bold : true,
            },
            subheader : {
                fontSize : 9
            },
            tableHeader : {
                fontSize : 10,
                color : 'white',
                fillColor : 'grey',
                alignment : 'center',
                margin : [0,5],
                border : [true,false,true,false]
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
            font : 'Roboto',
            columnGap : 5
        }
    }
}