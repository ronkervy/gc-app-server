const ProductModel = require('../models/product.model');
const SupplierModel = require('../models/supplier.model');
const DeliveryModel = require('../models/delivery.model');
const TransactionModel = require('../models/transaction.model');

const createHttpError = require('http-errors');
const {createPdf} = require('../config/create.pdf');
const DocumentDef = require('../config/DocumentDef');
const transactionDocDef = require('../config/PrintDocDef');
const path = require('path');
const fs = require('fs');

module.exports = {
    generatePdf : async ( req,res,next )=>{
        try{
            const { id } = req.params;
            
            const resDelivery = await DeliveryModel.find({delivery_id : id}).populate({
                path : 'products',
                select : 'item_name item_price'
            }).populate({
                path: 'suppliers',
                select : 'supplier_name'
            });
            
            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            let prodArr = resDelivery.map(delivery=>{

                let arr = [];                

                delivery.products.map((prod,index)=>{                 
                    arr.push(
                        {text : prod.item_name, style : 'tableItems'},
                        {text : delivery.delivery_qty, style : 'tableItems'},
                        {text : numberWithCommas(delivery.item_price),style : 'tableItems'},
                        {text : delivery.item_discount === 0 ? 'net' : delivery.item_discount + '%', style : 'tableItems'},
                        {text : delivery.suppliers[index].supplier_name,style : 'tableItems'},
                        {text : numberWithCommas(delivery.total_item_price),style : 'tableItems'}                  
                    );
                });
                return arr;
            });

            const docDef = DocumentDef(prodArr);   
            const logoPath = path.resolve(__dirname,'../','renderer/main_window/public/img/logo.png');  
            let pngimage = fs.readFileSync(logoPath);

            return res.json({
                doc : JSON.stringify(prodArr),
                logo : new Buffer.from(pngimage).toString('base64')
            });

            // let binaryResult = await createPdf(docDef,id);
            // return res.contentType('application/pdf').send(binaryResult.binary);            

        }catch(err){
            return next(createHttpError.Unauthorized({
                message : err.message
            }));
        }
    },
    transactionDoc : async( req,res,next )=>{
        try{
            const { id } = req.params;
            
            const resTransaction = await TransactionModel.find({
                transact_id : id
            }).populate({
                path : 'product',
                select : 'item_name item_price suppliers',
                populate : {
                    path : 'suppliers',
                    select : 'supplier_name'
                }
            });

            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            let transArr = resTransaction.map((transaction,index)=>{

                let arr = [];               

                transaction.product.suppliers.map(supp=>{
                    arr.push(
                        {text : transaction.product.item_name, style : 'tableItems'},
                        {text : supp.supplier_name, style : 'tableItems'},
                        {text : transaction.qty, style : 'tableItems'},                        
                        {text : parseFloat(transaction.item_current_price).toFixed(2), style : 'tableItems'},
                        {text : parseFloat(transaction.total_per_unit).toFixed(2), style : 'tableItems'},
                        {text : transaction.discount > 0 ? parseFloat(transaction.discount) * 100 + ' %' : 'Net', style : 'tableItems'}
                    );
                });

                return arr;
            });

            const docDef = transactionDocDef(transArr,resTransaction.map(transaction=>{
                return {
                    customer_name : transaction.customer_name,
                    date : transaction.createdAt,
                    transact_type : transaction.transact_payment_type,
                    total_amount : transaction.total_amount
                };
            }));

            // return res.json(docDef);

            const binaryResult = await createPdf(docDef,id);    
            return res.contentType('application/pdf').send(binaryResult.binary);
            
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    }
}