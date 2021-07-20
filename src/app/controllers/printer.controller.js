const ProductModel = require('../models/product.model');
const SupplierModel = require('../models/supplier.model');
const DeliveryModel = require('../models/delivery.model');
const TransactionModel = require('../models/transaction.model');
const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});

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
            const { from,to,payment_type } = req.query;

            const toDate = new Date(to);  
           
            if( model === 'deliveries'){                

                const resDeliveries = await DeliveryModel.aggregate([
                    {'$match' : 
                        {
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            },
                            "transact_payment_type" : payment_type
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

                const deliveryArr = resDeliveries.map(delivery=>{
                    let arr = [];

                    arr.push(
                        {text : delivery._id},
                        {text : delivery.count},
                        {text : delivery.date},
                        {text : delivery.total},
                        {text : delivery.status}
                    );

                    return arr;
                });

                return res.status(200).json({
                    doc : JSON.stringify(deliveryArr),
                    logo : new Buffer.from(pngimage).toString('base64')
                });

                // return res.status(200).json(resDeliveries);

            }else if( model === 'transactions' ){
                
                const optMatch = payment_type === undefined ? (
                    { '$match' :
                        {                                          
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            }
                        }
                    }
                ) : (
                    { '$match' :
                        {                                          
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            },
                            "transact_payment_type" : payment_type
                        }
                    }
                );
                
                const resTransaction = await TransactionModel.aggregate([
                    optMatch,
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
                            'total_amount' : { '$first' : '$total_amount' },
                            'change_amount' : { '$first' : '$change_amount' },
                            'balance' : { "$first" : "$partial_payments" }
                        }  
                    },
                    { "$sort" : 
                        {
                            'transaction_date' : -1
                        }
                    }
                ]);

                let pngimage = fs.readFileSync(logoPath);

                const transArr = resTransaction.map(transaction=>{
                    let arr = [];

                    const tdate = new Date(transaction.transaction_date).toISOString().split("T")[0];

                    const balance = transaction.balance.reduce((a,b)=>a+b,0);
                    
                    const remainBalance = transaction.payment_type === 'partial' && balance !== transaction.total_amount ? transaction.total_amount - balance : 0;

                    arr.push(
                        {text : transaction.customer_name,style : 'tableItems'},
                        {text : transaction._id,style : ['tableItems','trans_id']},
                        {text : tdate,style : 'tableItems'},
                        {text : transaction.payment_type,style : 'tableItems'},
                        {text : formatter.format(remainBalance), style : 'tableItems' },
                        {
                            text : formatter.format(transaction.total_amount),
                            style : 'tableItems',
                            price : transaction.total_amount,
                            from,
                            to
                        }
                    );

                    return arr;
                });

                return res.status(200).json({
                    doc : JSON.stringify(transArr),
                    logo : new Buffer.from(pngimage).toString('base64')
                });
            }
            
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    }
}