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

const logoPath = path.resolve(__dirname,'../','renderer/main_window/public/img/logo.png');

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
    },
    generateReportDoc : async(req,res,next)=>{
        try{
            const { model } = req.params;
            const { from,to,id } = req.query;

            const toDate = new Date(to);            
           
            if( model === 'deliveries'){

                const resDeliveries = await DeliveryModel.aggregate([
                    {'$match' : 
                        {
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            }
                        }
                    },
                    {'$unwind' : '$products'},                
                    {'$unwind' : '$delivery_qty'},
                    {'$unwind' : '$item_discount'},
                    {'$unwind' : '$total_item_price'},
                    {'$unwind' : '$createdAt'},
                    {'$unwind' : '$delivery_status'},                
                    {'$lookup' : 
                        {
                            from : 'products',
                            localField : 'products',
                            foreignField : '_id',
                            as : 'products'
                        }
                    },                                
                    {'$lookup' : 
                        {
                            from : 'suppliers',
                            localField : 'products.suppliers',
                            foreignField : '_id',
                            as : 'suppliers'
                        }
                    },
                    {'$unwind' : '$products'},
                    {'$unwind' : '$suppliers'},                    
                    {'$group' : 
                        { 
                            '_id' : '$delivery_id',                        
                            'count' : { '$sum' : 1 },
                            'products' : {
                                '$push' : { 
                                    'id'  : '$products._id',
                                    'item' : '$products.item_name',
                                    'qty' : '$delivery_qty',
                                    'total' : '$total_item_price',
                                }
                            },
                            'date' : { '$first' : '$createdAt' },
                            'total' : { '$sum' : '$total_item_price' },
                            'status' : { '$first' : '$delivery_status' }
                        }
                    },
                    {'$sort' : 
                        { 'date' : 1 }
                    },
                ]);

                let pngimage = fs.readFileSync(logoPath);

                const delArr = resDeliveries.map(delivery=>{
                    let arr = [];

                    

                    return arr;
                });

                return res.status(200).json({
                    doc : JSON.stringify(delArr),
                    logo : new Buffer.from(pngimage).toString('base64')
                });

                // return res.status(200).json(resDeliveries);

            }else if( model === 'transactions' ){
                const resTransaction = await TransactionModel.aggregate([
                    { '$match' :
                        {
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            }
                        }
                    },
                    { '$lookup' :
                        {
                            from : 'products',
                            localField : 'product',
                            foreignField : '_id',
                            as : 'products'
                        }
                    },
                    {'$unwind' : '$products'},
                    {
                        '$lookup' : 
                        {
                            from : 'suppliers',
                            localField : 'products.suppliers',
                            foreignField : '_id',
                            as : 'suppliers'
                        }
                    },
                    {'$unwind' : '$suppliers'},
                    { "$group" :
                        {
                            '_id' : '$transact_id',
                            'customer_name' : { '$first' : '$customer_name' },
                            'cart_count' : { '$sum' : 1 },
                            'cart' : {
                                '$push' : {
                                    'id' : '$products._id',
                                    'item' : '$products.item_name',
                                    'unit_price' : '$products.item_price',
                                    'purchased_qty' : '$qty',
                                    'inventory_qty' : '$products.item_qty',
                                    'discount' : '$discount',
                                    'supplier' : '$suppliers.supplier_name'
                                }
                            },                        
                            'transaction_date' : { '$first' : '$createdAt' },
                            'payment_type' : { '$first' : '$transact_payment_type' },
                            'cash_amount' : { '$first' : '$cash_amount' },
                            'total_price' : { '$first' : '$total_amount' },
                            'change_amount' : { '$first' : '$change_amount' }
                        }  
                    },
                    { "$sort" : 
                        {
                            'transaction_date' : -1
                        }
                    }
                ]);

                return res.status(200).json(resTransaction);
            }
            
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    }
}