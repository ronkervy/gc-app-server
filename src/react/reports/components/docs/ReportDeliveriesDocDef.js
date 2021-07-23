const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

export default (docs,logoURL,prods)=>{

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
            },
            {
                table : {
                    headerRows : 1,
                    widths : ['*','*','*','*'],
                    body : [
                        [
                            {
                                text : [
                                    "Date generated : ",
                                    { text : `${new Date(Date.now()).toLocaleDateString()}` }
                                ],
                                style : { fontSize : 9 },

                            },
                            {
                                text : [
                                    "Date generated : ",
                                    { text : `${new Date(Date.now()).toLocaleDateString()}` }
                                ],
                                style : { fontSize : 9 },
                                
                            },
                            {
                                text : [
                                    "Date generated : ",
                                    { text : `${new Date(Date.now()).toLocaleDateString()}` }
                                ],
                                style : { fontSize : 9 },
                                
                            },
                            {
                                text : [
                                    "Date generated : ",
                                    { text : `${new Date(Date.now()).toLocaleDateString()}` }
                                ],
                                style : { fontSize : 9 },
                                
                            },
                        ]
                    ]
                },
                margin : [0,10,0,0]
            },               
            {
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: [ '*', '*', '*', '*','*','*'],
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
                        ...docs
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
                },
                table : {
                    headerRows: 1,
                    widths: ['*','*','*'],
                    body : [
                        [
                            { text : 'Product Name', style : 'tableHeader'  },
                            { text : 'QTY', style : 'tableHeader'  },
                            { text : 'Total Amount', style : 'tableHeader'  },                            
                        ],
                        ...prods
                    ]
                },
                margin : [0,10,0,0]
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