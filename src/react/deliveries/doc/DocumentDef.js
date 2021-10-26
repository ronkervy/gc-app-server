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
    Charlie_dotted : {
        normal : 'charlie_dotted.ttf',
        bold : 'charlie_dotted.ttf',
        italics : 'charlie_dotted.ttf',
        bolditalics : 'charlie_dotted.ttf'
    },
    DOT_MATRIX : {
        normal : 'DOTMATRI.TTF',
        bold : 'DOTMATRI.TTF',
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
    
    let arrTotal = [];
    let date,sold_to,address,status;

    docs.map((doc,i)=>{
        date = doc[5].date.split('T')[0];
        sold_to = doc[5].sold_to;
        address = doc[5].address;
        status = doc[5].status
        arrTotal.push(doc[5].total);
    });

    let total = arrTotal.reduce((a,b)=>a+b,0);

    return {
        pageSize : 'A4',
        pageMargins: [ 30, 80, 30, 80 ],
        header : (currentPage)=>{
            if( currentPage === 1 ){
                return {
                    columns : [
                        {
                            image : `data:image/png;base64,${logoURL}`,
                            width : 40,
                            height : 40,
                            margin : [10,5]
                        },
                        {
                            stack : [
                                {
                                    text : 'GLORIOCITY \n',
                                    style : 'header'
                                },
                                {
                                    text : 'CONSTRUCTION SUPPLY',
                                    style : 'subheader'
                                }
                            ],
                            margin : [10,12]
                        },
                        {
                            stack : [
                                {
                                    text : '4024 BLOCK 2 LOT 17-18',
                                },
                                {
                                    text : 'MONDO STRIP JUBILATION',
                                },
                                {
                                    text : 'BRGY.PLATERO',
                                }
                            ],
                            alignment : 'right',
                            margin : [10,12],
                            fontSize : 8             
                        }      
                    ],
                    margin : [20,8],
                    width : '*',
                }
            }
        },
        footer : ( currentPage, pageCount )=>{
            if( currentPage === pageCount ){
                return {
                    stack : [
                        {
                            table : {
                                headerRows : 1,
                                widths : ['*','*','*'],
                                body : [
                                    [
                                        {
                                            text : "Issued By : ",
                                            style : {
                                                fontSize : 8,
                                            },
                                            margin : [0,5]
                                        },  
                                        {
                                            text : "Prepared By : ",
                                            style : {
                                                fontSize : 8,
                                            },
                                            margin : [0,5]
                                        },
                                        {
                                            text : "Released By : ",
                                            style : {
                                                fontSize : 8,
                                            },
                                            margin : [0,5]
                                        },                                      
                                    ]
                                ]
                            },   
                            margin : [40,0,40,10]                                               
                        },
                        {
                            columns : [
                                {
                                    text : "************** Nothing Follows **************",                            
                                    style : {
                                        alignment : 'center',
                                        italics : true,
                                        color : "maroon",
                                        fontSize : 8
                                    }                            
                                }
                            ]
                        },
                    ],
                }
            }
        },
        content: [
            {
                text : "Delivery Receipt",
                style : {
                    fontSize : 16,
                },
                alignment : "center",
                margin : [0,10,0,10]
            },
            {
                table : {
                    dontBreakRows : false,
                    headerRows : 1,
                    widths : ['*','*'],
                    body : [
                        [
                            { 
                                text : `Date : ${date}`, 
                                style : ['cellPadding',{
                                    alignment : 'center',
                                    fontSize : 10,
                                    font : 'Arial',                                   
                                }]
                            },
                            {
                                text : `Total Amount : ${formatter.format(total)}`, 
                                style : ['cellPadding',{
                                    alignment : 'center',
                                    fontSize : 10,
                                    font : 'Arial',                                
                                }]
                            },
                        ]
                    ],
                },
                margin : [0,0,0,10]
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
                margin : [0,0,0,0]
            }            
        ],
        styles : {
            header : {
                bold : true,
            },
            subheader : {
                fontSize : 9,
            },
            cellPadding : {
                margin : [0,5,0,5]
            },
            tableHeader : {
                fontSize : 10,
                color : 'white',
                fillColor : 'grey',
                alignment : 'center',
                margin : [0,5],
                border : [true,false,true,false]
            },
            tableItemsAmount : {
                alignment : 'center',
                margin : [0,6],
                fontSize : 9,
                font : "Arial",
            },
            tableItems : {
                alignment : 'center',
                margin : [0,5],
                fontSize : 9,
            }
        },
        defaultStyle : {
            font : 'Arial',
            columnGap : 5
        }
    }
}