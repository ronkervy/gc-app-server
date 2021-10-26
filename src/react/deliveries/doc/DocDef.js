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
    let date,sold_to,address,status,total_item_price;

    docs.map((doc,i)=>{
        date = doc[5].date.split('T')[0];
        sold_to = doc[5].sold_to;
        address = doc[5].address;
        status = doc[5].status;
        total_item_price = doc[5].total_item_price;
        arrTotal.push(doc[5].total);

        console.log(doc[5])
    });    

    let total = arrTotal.reduce((a,b)=>a+b,0);

    return {
        content: [
          {
            columns: [
              {
                image:
                  `data:image/png;base64,${logoURL}`,
                width: 150,
              },
              [
                {
                  text: 'Receipt',
                  color: '#333333',
                  width: '*',
                  fontSize: 28,
                  bold: true,
                  alignment: 'right',
                  margin: [0, 0, 0, 15],
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: 'Receipt No.',
                          color: '#aaaaab',
                          bold: true,
                          width: '*',
                          fontSize: 12,
                          alignment: 'right',
                        },
                        {
                          text: '00001',
                          bold: true,
                          color: '#333333',
                          fontSize: 12,
                          alignment: 'right',
                          width: 100,
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: 'Date Issued',
                          color: '#aaaaab',
                          bold: true,
                          width: '*',
                          fontSize: 12,
                          alignment: 'right',
                        },
                        {
                          text: `${date}`,
                          bold: true,
                          color: '#333333',
                          fontSize: 12,
                          alignment: 'right',
                          width: 100,
                        },
                      ],
                    },
                    {
                      columns: [
                        {
                          text: 'Status',
                          color: '#aaaaab',
                          bold: true,
                          fontSize: 12,
                          alignment: 'right',
                          width: '*',
                        },
                        {
                          text: `${status === false ? 'Not Delivered' : 'Delivered'}`,
                          bold: true,
                          fontSize: 14,
                          alignment: 'right',
                          color: 'green',
                          width: 100,
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          {
            columns: [
              {
                text: 'Sold To',
                color: '#aaaaab',
                bold: true,
                fontSize: 14,
                alignment: 'left',
                margin: [0, 20, 0, 5],
              },
            ],
          },
          {
            columns: [
              {
                text: `${sold_to}`,
                bold: true,
                color: '#333333',
                alignment: 'left',
              }
            ],
          },
          {
            columns: [
              {
                text: 'Address',
                color: '#aaaaab',
                bold: true,
                margin: [0, 7, 0, 3],
              }
            ],
          },
          {
            columns: [
              {
                text: `${address}`,
                style: 'invoiceBillingAddress',
              }
            ],
          },
          '\n\n',
          {
            width: '100%',
            alignment: 'center',
            text: 'Invoice No. 123',
            bold: true,
            margin: [0, 10, 0, 10],
            fontSize: 15,
          },
          {
            layout: {
              defaultBorder: false,
              hLineWidth: function(i, node) {
                return 1;
              },
              vLineWidth: function(i, node) {
                return 1;
              },
              hLineColor: function(i, node) {
                if (i === 1 || i === 0) {
                  return '#bfdde8';
                }
                return '#eaeaea';
              },
              vLineColor: function(i, node) {
                return '#eaeaea';
              },
              hLineStyle: function(i, node) {
                // if (i === 0 || i === node.table.body.length) {
                return null;
                //}
              },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              paddingLeft: function(i, node) {
                return 10;
              },
              paddingRight: function(i, node) {
                return 10;
              },
              paddingTop: function(i, node) {
                return 2;
              },
              paddingBottom: function(i, node) {
                return 2;
              },
              fillColor: function(rowIndex, node, columnIndex) {
                return '#fff';
              },
            },
            table: {
              headerRows: 1,
              widths: ['*', 80],
              body: [
                [
                  {
                    text: 'ITEM DESCRIPTION',
                    fillColor: '#eaf2f5',
                    border: [false, true, false, true],
                    margin: [0, 5, 0, 5],
                    textTransform: 'uppercase',
                  },
                  {
                    text: 'ITEM TOTAL',
                    border: [false, true, false, true],
                    alignment: 'right',
                    fillColor: '#eaf2f5',
                    margin: [0, 5, 0, 5],
                    textTransform: 'uppercase',
                  },
                ],
                [
                  {
                    text: 'Item 1',
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                    alignment: 'left',
                  },
                  {
                    border: [false, false, false, true],
                    text: '$999.99',
                    fillColor: '#f5f5f5',
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  },
                ],
                [
                  {
                    text: 'Item 2',
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                    alignment: 'left',
                  },
                  {
                    text: '$999.99',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  },
                ],
              ],
            },
          },
          '\n',
          '\n\n',
          {
            layout: {
              defaultBorder: false,
              hLineWidth: function(i, node) {
                return 1;
              },
              vLineWidth: function(i, node) {
                return 1;
              },
              hLineColor: function(i, node) {
                return '#eaeaea';
              },
              vLineColor: function(i, node) {
                return '#eaeaea';
              },
              hLineStyle: function(i, node) {
                // if (i === 0 || i === node.table.body.length) {
                return null;
                //}
              },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              paddingLeft: function(i, node) {
                return 10;
              },
              paddingRight: function(i, node) {
                return 10;
              },
              paddingTop: function(i, node) {
                return 3;
              },
              paddingBottom: function(i, node) {
                return 3;
              },
              fillColor: function(rowIndex, node, columnIndex) {
                return '#fff';
              },
            },
            table: {
              headerRows: 1,
              widths: ['*', 'auto'],
              body: [
                [
                  {
                    text: 'Payment Subtotal',
                    border: [false, true, false, true],
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  },
                  {
                    border: [false, true, false, true],
                    text: '$999.99',
                    alignment: 'right',
                    fillColor: '#f5f5f5',
                    margin: [0, 5, 0, 5],
                  },
                ],
                [
                  {
                    text: 'Discount total price',
                    border: [false, false, false, true],
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  },
                  {
                    text: '$999.99',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                    alignment: 'right',
                    margin: [0, 5, 0, 5],
                  },
                ],
                [
                  {
                    text: 'Total Amount',
                    bold: true,
                    fontSize: 20,
                    alignment: 'right',
                    border: [false, false, false, true],
                    margin: [0, 5, 0, 5],
                  },
                  {
                    text: `${total}`,
                    bold: true,
                    fontSize: 20,
                    alignment: 'right',
                    border: [false, false, false, true],
                    fillColor: '#f5f5f5',
                    margin: [0, 5, 0, 5],
                  },
                ],
              ],
            },
          },
          '\n\n',
          {
            text: 'NOTES',
            style: 'notesTitle',
          },
          {
            text: 'Some notes goes here \n Notes second line',
            style: 'notesText',
          },
        ],
        styles: {
          notesTitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 50, 0, 3],
          },
          notesText: {
            fontSize: 10,
          },
        },
        defaultStyle: {
          columnGap: 20,
          font: 'Times',
        },
      };
}