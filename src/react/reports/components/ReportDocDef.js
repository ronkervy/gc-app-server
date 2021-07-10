export default (docs,logoURL)=>{
    return {
        pageSize : 'A4',
        pageMargins: [ 40, 80, 40, 60 ],
        header : (currentPage)=>{
            if( currentPage === 1 ){
                return {
                    columns : [
                        {
                            image : `data:image/png;base64,${logoURL}`,
                            width : 40,
                            height : 40,
                            margin : [20,5]
                        },
                        {
                            stack : [
                                {
                                    text : 'Glorious Cocolumber \n',
                                    style : 'header'
                                },
                                {
                                    text : 'and Construction Supply',
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
            }
        },
        footer : {
            columns : [
                {
                    text : "Footer",
                    alignment : 'center'
                }
            ]
        },
        content: [
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
                    headerRows: 1,
                    widths: [ '*', 40, '*', '*','*', '*'],
                    body: [
                        [
                            {
                                text : 'Name',
                                style : 'tableHeader'
                            }, 
                            {
                                text : 'QTY',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Unit Price',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Discount',
                                style : 'tableHeader'
                            },
                            {
                                text : 'Supplier',
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
                margin : [0,50,0,0]
            },
            {
                layout: {
                    hLineWidth : (i,node)=>{
                        return (i === 0 || i === node.table.body.length) ? 1 : 0;
                    },
                    hLineHeight : (i,node)=>{
                        return (i === 0 || i === node.table.body.widths) ? 1 : 0;
                    }
                }, // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    // heights : (row)=>{
                    //     return (row + 1) * 25;
                    // },
                    widths: ['*','*'],
                    body: [
                        [
                            {
                                text : '',
                                fillColor : 'grey'
                            },
                            '',
                        ],
                        [
                            {
                                text : 'Total Price',
                                alignment : 'center',
                                color : 'white',
                                fillColor : 'grey',
                                fontSize : 9,
                                margin : [0,4]
                            },
                            { 
                                text : 'P 1200',
                                alignment : 'center',
                                rowSpan : 2,
                                fontSize : 9,
                                margin : [0,4]
                            }
                        ],
                        [   
                            {
                                text : '',
                                fillColor : 'grey'
                            },
                            ''
                        ]
                    ]
                },
                margin : [0,10]                
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
            }
        },
        defaultStyle : {
            font : 'Roboto',
            columnGap : 5
        }
    }
}