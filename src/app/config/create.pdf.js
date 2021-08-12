const fs = require("fs");
const PDFDocument = require('pdfmake/build/pdfmake.js');
const path = require('path');

PDFDocument.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
}

module.exports = {
    createPdf : (pdfdoc,id)=>{     

        let printer = new PDFDocument();
        let doc = printer.createPdfKitDocument(pdfdoc);
        
        let chunks = [];

        return new Promise((resolve,reject)=>{
            try{
                doc.on('data',(chunk)=>{
                    chunks.push(chunk);
                });
                doc.on('end',()=>{
                    resolve({
                        binary : Buffer.concat(chunks),
                        dir : path.join(__dirname,'..','/renderer/main_window',`/public/pdfs/${id}-invoice.pdf`)
                    });
                });
                doc.pipe(fs.createWriteStream(path.join(__dirname,'..','/renderer/main_window',`/public/pdfs/${id}-invoice.pdf`)));
                doc.end();
            }catch(err){
                reject(err);
            }
        });

    }
}