const DeliveryModel = require('../models/delivery.model');
const TransactionModel = require('../models/transaction.model');
const formatter = new Intl.NumberFormat('en-PH',{
    style : 'currency',
    currency : 'Php'
});
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Manila");

const createHttpError = require('http-errors');
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

            let prodArr = resDelivery.map(delivery=>{

                let arr = [];                

                delivery.products.map((prod,index)=>{                 
                    arr.push(
                        {text : prod.item_name, style : 'tableItems'},
                        {text : delivery.delivery_qty, style : 'tableItems'},
                        {text : formatter.format(delivery.item_price),style : 'tableItemsAmount'},
                        {text : delivery.item_discount === 0 ? 'net' : delivery.item_discount + '%', style : 'tableItems'},
                        {text : delivery.suppliers[index].supplier_name,style : 'tableItems'},
                        {
                            text : formatter.format(delivery.total_item_price),
                            style : 'tableItemsAmount',
                            total : delivery.total_item_price,
                            date : delivery.createdAt,
                            sold_to : delivery.sold_to,
                            address : delivery.delivery_address,
                            status : delivery.delivery_status,
                            total_item_price : delivery.total_item_price
                        }                  
                    );
                });
                return arr;
            });

            let pngimage = fs.readFileSync(logoPath);

            return res.json({
                doc : JSON.stringify(prodArr),
                logo : new Buffer.from(pngimage).toString('base64')
            });          

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
                select : 'item_name item_price item_srp suppliers item_unit',
                populate : {
                    path : 'suppliers',
                    select : 'supplier_name'
                }
            });

            let transArr = resTransaction.map((transaction,index)=>{

                let arr = [];               

                transaction.product.suppliers.map(supp=>{
                    arr.push(
                        {text : transaction.qty, style : 'tableItems'},  
                        {text : transaction.product.item_unit.toUpperCase(), style : 'tableItems'},
                        {text : transaction.product.item_name, style : 'tableItems'},                                              
                        {text : formatter.format(transaction.item_current_price), style : 'tableItemsAmount'},
                        {
                            text : formatter.format(transaction.total_per_unit_srp), 
                            style : 'tableItemsAmount',
                            _id : transaction.transact_id,
                            customer_name : transaction.customer_name,
                            price : transaction.item_current_price,
                            date : transaction.createdAt,
                            transact_type : transaction.transact_payment_type,
                            cash_amount : formatter.format(transaction.cash_amount),
                            total_amount : transaction.total_amount_srp,
                            total_amount_default : transaction.total_amount,
                            change_amount : transaction.change_amount_srp,
                            discount : transaction.discount,
                            customer_address : transaction.customer_address                
                        }                        
                    );
                });

                return arr;
            });

            let pngimage = fs.readFileSync(logoPath);

            return res.status(200).json({
                doc : JSON.stringify(transArr),
                logo : new Buffer.from(pngimage).toString('base64')
            });
            
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    generateReportDoc : async(req,res,next)=>{
        try{
            const { model } = req.params;
            const { from,to,payment_type,status } = req.query;

            const toDate = new Date(to);
           
            if( model === 'deliveries'){   
                
                const statVal = status == "delivered";

                const optMatch = status === undefined ? (
                    {'$match' : 
                        {
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            }                            
                        }
                    }
                ) : (
                    {'$match' : 
                        {
                            "createdAt" : {
                                "$gte" : new Date(from),
                                "$lte" : new Date(toDate.setDate(toDate.getDate() + 1))
                            },
                            "delivery_status" : statVal
                        }
                    }
                );

                const resDeliveries = await DeliveryModel.aggregate([
                    optMatch,
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
                                    'item_name' : '$products.item_name',
                                    'qty' : '$delivery_qty',
                                    'total' : '$total_item_price',
                                }
                            },
                            'date' : { '$first' : '$createdAt' },
                            'date_delivered' : { '$first' : '$updatedAt' },
                            'total' : { '$sum' : '$total_item_price' },
                            'status' : { '$first' : '$delivery_status' }
                        }
                    },
                    {'$sort' : 
                        { 'date' : -1 }
                    },
                ]);

                let pngimage = fs.readFileSync(logoPath);                                
                let resArrProd = [];                

                const deliveryArr = resDeliveries.map((delivery,i)=>{                                   
                    let arr = [];     
                    let delivDate = new Date(delivery.date).toISOString().split('T')[0];
                    let deliveredDate = new Date(delivery.date_delivered).toISOString().split('T')[0];
                    
                    resArrProd = delivery.products.map((product,ind)=>{

                        let arrProd = [];
                        arrProd.push(
                            { text : product.item_name, style : 'tableItems'},
                            { text : product.qty, style : 'tableItems'},
                            { text : formatter.format(product.total), style : 'tableItems' }
                        );

                        return arrProd;
                    });

                    arr.push(
                        {text : delivery._id, style : ['tableItems','trans_id']},
                        {text : delivDate, style : 'tableItems'},
                        {text : (delivery.status ? deliveredDate : '--------'), style : 'tableItems'},
                        {text : (delivery.status ? 'Delivered' : 'Pending'), style : 'tableItems'},                        
                        {text : delivery.count, style : 'tableItems'},                       
                        {
                            text : formatter.format(delivery.total), 
                            style : 'tableItems',
                            prods : delivery.products,
                            from,
                            to,
                            total : delivery.total
                        }
                    );
                    return arr;
                });

                return res.status(200).json({
                    doc : JSON.stringify(deliveryArr),
                    logo : new Buffer.from(pngimage).toString('base64'),
                    prods : JSON.stringify(resArrProd)
                });

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
                            'customer_address' : { '$first' : '$cutomer_address' },
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
                            'total_amount' : { '$first' : '$total_amount_srp' },
                            'total_amount_default' : { '$first' : '$total_amount' },
                            'change_amount' : { '$first' : '$change_amount_srp' },
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
                            total_amount_default : transaction.total_amount_default,
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