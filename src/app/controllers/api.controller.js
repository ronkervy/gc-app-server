const ProductModel = require('../models/product.model');
const SupplierModel = require('../models/supplier.model');
const DeliveryModel = require('../models/delivery.model');
const TransactionModel = require('../models/transaction.model');

const createHttpError = require('http-errors');
const os = require('os');
const { v4 : uuidV4 } = require('uuid');
const { Types } = require('mongoose');
 
module.exports = {
    //SERVER API
    serverInfo : (req,res,next)=>{        

        res.status(200).json({
            server_name : os.hostname(),
            server_version : os.version(),
            server_platform : os.platform() + os.arch()            
        });
    },
    //PRODUCT API
    productList : async (req,res,next)=>{
        try{
            const products = await ProductModel.find().sort({ 'createdAt' : 'desc' });
            res.status(200).json(products);

        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    productSingle : async (req,res,next)=>{
        try{
            const {
                id
            } = req.params;

            const resProduct = await ProductModel.findById(id).populate({
                path : 'suppliers',
                select : 'supplier_name'
            });

            res.status(200).json( resProduct );

        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }        
    },
    productSearch : async (req,res,next)=>{
        try{
            const {
                query
            } = req.query;

            console.log(query);

            const resProduct = await ProductModel.find({ $or : [{item_name : { $regex : query + '+', $options : 'gi' }},{ item_code : { $regex : query + '+', $options : 'gi' } }]});

            res.status(200).json( resProduct );


        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    productMultipleCreate : async(req,res,next)=>{
        try{
            const resCreate = await ProductModel.insertMany(req.body);
        }catch(err){
            return next(createHttpError.InternalServerError({
                message : err.message
            }));
        }
    },
    productCreate : async (req,res,next)=>{
        try{

            const {
                item_name,
                item_supplier
            } = req.body;
            
            const productResult = await ProductModel.findOne({ item_name });
            
            if( productResult !== null ) return next( createHttpError.Conflict({
                message : "Item already existing in the database."
            }) );

            await SupplierModel.findById(item_supplier).then(async (supp)=>{                
                const newProduct = new ProductModel({
                    ...req.body,
                    item_price : parseFloat(req.body.item_price)
                });
                newProduct.suppliers.push(supp._id);                
                const product = await newProduct.save().then((createdProd)=>{
                    supp.products.push(createdProd);
                    supp.save();
                });

                const refreshProd = await ProductModel.find();
                
                return res.status(201).json(refreshProd);
            });                        

        }catch(err){
            return next(createHttpError.Unauthorized({
                message : "Server Error : " + err.message
            }));
        }
    },
    productUpdate : async (req,res,next)=>{
        try{
            const {
                id
            } = req.params;

            const {
                item_supplier
            } = req.body;

            const { transact_id } = req.query;
            
            
            const productUpdated = await ProductModel.findOneAndUpdate({
                item_id : id
            },{
                ...req.body
            },async (err,product)=>{
                try{
                    product.suppliers = [];
                    product.suppliers.push(item_supplier);
                    await product.save();
                    
                    //Find the supplier in the suppliers table
                    const resSupp = await SupplierModel.findById(item_supplier);
                    const resProdIndex = resSupp.products.indexOf(product._id);
    
                    if( resProdIndex === -1 ){
                        //before push make sure that the entries in the old supplier is remove
                        const oldSuppIndex = product.suppliers.indexOf(item_supplier);
    
                        if( oldSuppIndex !== -1 ){
                            const oldSupplier = await SupplierModel.findById(product.item_supplier);
                            const oldSuppProdIndex = oldSupplier.products.indexOf(product._id);
                            if( oldSuppProdIndex !== -1 ){
                                oldSupplier.products.splice(oldSuppProdIndex,1);
                                await oldSupplier.save();
                            }
                        }
                        resSupp.products.push(product);
                    }else{
                        resSupp.products.map(prods=>{
                            return {
                                ...prods
                            }
                        });
                    }
    
                    await resSupp.save(); 
                }catch(err){
                    return createHttpError.Unauthorized({
                        message : err.message
                    });
                }                           
            });

            if( productUpdated === null ) return next( createHttpError.NotFound({
                message : "Product not found."
            }) );

            return res.status(200).json(productUpdated);

        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    productDelete : async (req,res,next)=>{
        try{
            const { id } = req.params;
            const resProd = await ProductModel.deleteOne({
                _id : id
            });

            const products = await ProductModel.find().sort({ 'createdAt' : 'desc' });            

            return res.status(200).json( products );
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },

    //TRANSACTION API
    transactionList : async ( req,res,next )=>{
        try{
            const resTrans = await TransactionModel.aggregate([
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
                                'unit_price_srp' : '$products.item_srp',
                                'purchased_qty' : '$qty',
                                'inventory_qty' : '$products.item_qty',
                                'discount' : '$discount',
                                'item_unit' : '$products.item_unit',
                                'supplier' : '$suppliers.supplier_name'
                            }
                        },                                                
                        'transaction_date' : { '$first' : '$createdAt' },
                        'payment_type' : { '$first' : '$transact_payment_type' },
                        'cash_amount' : { '$first' : '$cash_amount' },
                        'total_price' : { '$first' : '$total_amount' },
                        'total_price_srp' : { '$first' : '$total_amount_srp' },
                        'change_amount' : { '$first' : '$change_amount' },
                        'change_amount_srp' : { '$first' : '$change_amount_srp' },
                        'payments' : { '$first' : '$partial_payments' }
                    }  
                },
                { "$sort" : 
                    {
                        'transaction_date' : -1
                    }
                }
            ]);
            return res.json(resTrans);
        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionSearch : async( req,res,next )=>{
        try{
            const { s,date } = req.query;

            const optMatch = date !== undefined ? {
                '$match' : 
                    {                        
                        '$or' : [
                            {
                                "createdAt" : {
                                    '$gte' : new Date(date)
                                }
                            },                            
                            { "transact_payment_type" : s },
                            { "transact_id" : s },
                        ]
                    }
            } : {
                '$match' : 
                    {                        
                        '$or' : [
                            { "customer_name" : { '$regex' : s + '+', '$options' : 'gi' } },                            
                            { "transact_payment_type" : s },
                            { "transact_id" : { '$regex' : s + '+', '$options' : 'gi' } },
                        ]
                    }
            };
            
            const resTrans = await TransactionModel.aggregate([
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
                                'unit_price_srp' : '$products.item_srp',
                                'purchased_qty' : '$qty',
                                'inventory_qty' : '$products.item_qty',
                                'discount' : '$discount',
                                'item_unit' : '$products.item_unit',
                                'supplier' : '$suppliers.supplier_name'
                            }
                        },                                                
                        'transaction_date' : { '$first' : '$createdAt' },
                        'payment_type' : { '$first' : '$transact_payment_type' },
                        'cash_amount' : { '$first' : '$cash_amount' },
                        'total_price' : { '$first' : '$total_amount' },
                        'total_price_srp' : { '$first' : '$total_amount_srp' },
                        'change_amount' : { '$first' : '$change_amount' },
                        'change_amount_srp' : { '$first' : '$change_amount_srp' },
                        'payments' : { '$first' : '$partial_payments' }
                    }  
                },
                { "$sort" : 
                    {
                        'transaction_date' : 1
                    }
                }
            ]);
            return res.json( resTrans );
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionSingle : async ( req,res,next )=>{
        try{
            const { id } = req.params;
            const resTrans = await TransactionModel.aggregate([
                { '$match' :
                    { 
                        "transact_id" : id
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
                                'unit_price_srp' : '$products.item_srp',
                                'purchased_qty' : '$qty',
                                'inventory_qty' : '$products.item_qty',
                                'discount' : '$discount',
                                'item_unit' : '$products.item_unit',
                                'supplier' : '$suppliers.supplier_name'
                            }
                        },                                                
                        'transaction_date' : { '$first' : '$createdAt' },
                        'payment_type' : { '$first' : '$transact_payment_type' },
                        'cash_amount' : { '$first' : '$cash_amount' },
                        'total_price' : { '$first' : '$total_amount' },
                        'total_price_srp' : { '$first' : '$total_amount_srp' },
                        'change_amount' : { '$first' : '$change_amount' },
                        'change_amount_srp' : { '$first' : '$change_amount_srp' },
                        'payments' : { '$first' : '$partial_payments' }
                    }  
                },
                { "$sort" : 
                    {
                        'transaction_date' : -1
                    }
                }
            ]);
            return res.json( resTrans );
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionCreate : async ( req,res,next )=>{
        try{

            const transact_id = uuidV4();

            await TransactionModel.insertMany(req.body.map((order,index)=>{
                let obj_id = Types.ObjectId();

                ProductModel.findById(order._id).then(res=>{
                    res.transactions.push(obj_id);
                    res.save();
                });

                ProductModel.updateOne({
                    _id : order._id
                },{
                    item_qty : parseInt(order.inventory_qty) - parseInt(order.qty)
                }).then((result)=>{
                    return result.nModified;
                });

                return {
                    ...order,
                    _id : obj_id,
                    product : order._id,
                    item_current_price : order.item_srp, 
                    transact_id,
                    partial_payments : order.transact_payment_type == 'full' ? [] : [order.cash_amount]
                }
            }));

            return res.status(201).json({
                transact_id
            });

        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionUpdate : async ( req,res,next )=>{
        try{
            const { id } = req.params;
            console.log(req.body);
            const {
                partial_payments
            } = req.body;

            if( partial_payments == null || partial_payments == 0 ) return res.json({});

            let transact_status;

            const searchResult = await TransactionModel.find({
                transact_id : id
            });
            
            searchResult.map(transaction=>{                
                const sum = transaction.partial_payments.reduce((a,b)=>a+b,0);
                sum < transaction.total_amount ? transaction.partial_payments.push(partial_payments) : null;
                
                transaction.transact_payment_type = (transaction.cash_amount + partial_payments) >= transaction.total_amount ? 'full' : 'partial'
                transaction.transact_status = (transaction.cash_amount + partial_payments) >= transaction.total_amount ? true : false;
                transaction.cash_amount = transaction.cash_amount + partial_payments;     
                transaction.change_amount = transaction.change_amount + partial_payments;
                transaction.change_amount_srp = transaction.change_amount_srp + partial_payments; 
                transaction.save();
            });

            await TransactionModel.updateMany({
                transact_id : id
            },{
                transact_status
            });

            const resTrans = await TransactionModel.aggregate([
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
                                'unit_price_srp' : '$products.item_srp',
                                'purchased_qty' : '$qty',
                                'inventory_qty' : '$products.item_qty',
                                'discount' : '$discount',
                                'item_unit' : '$products.item_unit',
                                'supplier' : '$suppliers.supplier_name'
                            }
                        },                                                
                        'transaction_date' : { '$first' : '$createdAt' },
                        'payment_type' : { '$first' : '$transact_payment_type' },
                        'cash_amount' : { '$first' : '$cash_amount' },
                        'total_price' : { '$first' : '$total_amount' },
                        'total_price_srp' : { '$first' : '$total_amount_srp' },
                        'change_amount' : { '$first' : '$change_amount' },
                        'change_amount_srp' : { '$first' : '$change_amount_srp' },
                        'payments' : { '$first' : '$partial_payments' }
                    }  
                },
                { "$sort" : 
                    {
                        'transaction_date' : -1
                    }
                }
            ]);

            
            return res.json( resTrans );

        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionDelete : async ( req,res,next )=>{
        try{
            const { id } = req.params;
            const resTransaDel = await TransactionModel.deleteMany({
                transact_id : id
            });

            const resTrans = await TransactionModel.aggregate([
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
                                'unit_price_srp' : '$products.item_srp',
                                'purchased_qty' : '$qty',
                                'inventory_qty' : '$products.item_qty',
                                'discount' : '$discount',
                                'item_unit' : '$products.item_unit',
                                'supplier' : '$suppliers.supplier_name'
                            }
                        },                                                
                        'transaction_date' : { '$first' : '$createdAt' },
                        'payment_type' : { '$first' : '$transact_payment_type' },
                        'cash_amount' : { '$first' : '$cash_amount' },
                        'total_price' : { '$first' : '$total_amount' },
                        'total_price_srp' : { '$first' : '$total_amount_srp' },
                        'change_amount' : { '$first' : '$change_amount' },
                        'change_amount_srp' : { '$first' : '$change_amount_srp' },
                        'payments' : { '$first' : '$partial_payments' }
                    }  
                },
                { "$sort" : 
                    {
                        'transaction_date' : -1
                    }
                }
            ]);

            return res.json( resTrans );
        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    transactionCountMonthly : async(req,res,next)=>{
        try{
            const resTrans = await TransactionModel.aggregate([                   
                { "$project" :
                    {
                        "year" : { "$year": { "date" : "$createdAt", timezone : "Asia/Manila"} },
                        "month" : { "$month": { "date" : "$createdAt", timezone : "Asia/Manila"} },   
                        "total_earning" : { "$sum" : "$total_amount" },  
                        "transact_id" : "$transact_id"                                                          
                    }
                },                
                { "$unwind" : "$total_earning" },                
                { "$group" : 
                    {
                        "_id" :
                        { 
                            "year" : "$year",
                            "month" : "$month",
                            "id" : "$transact_id"
                        },
                        "total_earning" :
                        {
                            "$sum" : "$total_earning"
                        },
                        "transaction_count" : 
                        {
                            "$sum" : 1
                        }                                    
                    }, 
                },
                { "$group" : 
                    {
                        "_id" : {
                            "month" : "$_id.month"
                        },
                        "transaction_count" : { "$sum" : 1 }
                    }
                },
                {
                    "$limit" : 12
                },
                {
                    "$sort" : { "_id.month" : -1 }
                }
            ]);

            return res.status(200).json(resTrans);

        }catch(err){
            return next( createHttpError.InternalServerError({
                message : err.message
            }) );
        }
    },
    //SUPPLIERS API
    supplierList : async( req,res,next )=>{

        try{
            const suppliers = await SupplierModel.find().sort({ 'createdAt' : 'desc' });
            return res.status(200).json(suppliers);
            
        }catch(err){
            return next( createHttpError.Unauthorized() );
        }
    },
    supplierProducts : async( req,res,next )=>{

        try{
            const supplier = await SupplierModel.findById(req.params.id).populate({
                path : 'products'
            });

            if( !supplier ) return next( createHttpError.Unauthorized() );

            return res.json(supplier.products);

        }catch(err){
            return next(createHttpError.Unauthorized())
        }
    },
    supplierSingle : async( req,res,next )=>{
        try{
            const { id } = req.params;
            const supplier = await SupplierModel.findById(id);
            return res.status(200).json(supplier);
        }catch(err){
            return next( createHttpError.Unauthorized() );
        }
    },
    supplierCreate : async( req,res,next )=>{
        try{
            const {
                supplier_name
            } = req.body;
            const supplier = await SupplierModel.findOne({supplier_name});
    
            if( supplier !== null ) return next(createHttpError.Conflict({
                message : "Supplier already saved in the database."
            }));
    
            const newSupp = await SupplierModel.create(req.body);
            return res.status(201).json(newSupp);
            
        }catch(err){
            return next( createHttpError.Unauthorized() );
        }
    },
    supplierUpdate : async( req,res,next )=>{
        try{
            const { id } = req.params;
            const updatedSupp = await SupplierModel.findByIdAndUpdate(id,{
                ...req.body
            });
            return res.status(200).json(updatedSupp);
        }catch(err){
            return next( createHttpError.Unauthorized() );
        }
    },
    supplierDelete : async( req,res,next )=>{
        try{
            const { id } = req.params;
            const deleteSupp = await SupplierModel.deleteOne({
                _id : id
            });

            const resSupp = await SupplierModel.find({ 'createdAt' : 'desc' });
            return res.status(200).json(resSupp);
        }catch(err){
            return next( createHttpError.Unauthorized() );
        }
    },

    //DELIVERIES API
    deliveryList : async( req,res,next )=>{
        try{
            const deliveries = await DeliveryModel.aggregate([
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
                                'supplier' : '$suppliers.supplier_name',
                                'qty' : '$delivery_qty',
                                'discount' : '$item_discount',
                                'total' : '$total_item_price',
                            }
                        },
                        'date' : { '$first' : '$createdAt' },
                        'total' : { '$sum' : '$total_item_price' },
                        'status' : { '$first' : '$delivery_status' }
                    }
                },
                {'$sort' : 
                    { 'date' : -1 }
                },
            ]);
            
            return res.status(200).json(deliveries);
            
        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    deliverySingle : async( req,res,next )=>{
        try{
            const {
                id
            } = req.params;
            
            const delivery = await DeliveryModel.find({delivery_id : id}).populate('products');
            
            return res.status(200).json(delivery);

        }catch(err){    
            next(createHttpError.Unauthorized({
                message : err.message
            }));
        }
    },
    deliverySearch : async( req,res,next )=>{
        try{
            const {
                search
            } = req.params;

            const {
                p_id
            } = req.query;

            const resDelivery = await DeliveryModel.find({delivery_id : search}).populate({
                path : 'products',
                match : { _id : p_id },
                select : 'item_name'
            });

            return res.status(200).json(resDelivery);

        }catch(err){
            next(createHttpError.Unauthorized({
                message : err.message
            }));
        }
    },
    deliveryCreate : async( req,res,next )=>{
        try{
            let delivery_id = uuidV4();

            const deliveries = await DeliveryModel.insertMany(req.body.map( (item,index)=>{      
                let del_obj_id = Types.ObjectId();

                ProductModel.findById(item._id).then(res=>{
                    res.deliveries.push(del_obj_id);
                    res.save();
                });

                SupplierModel.findById(item.supplier).then(res=>{
                    res.deliveries.push(del_obj_id);
                    res.save();
                });

                let lessDiscount = (item.price * item.qty) * (item.item_discount / 100);

                return {
                    ...item,
                    _id : del_obj_id,
                    delivery_qty : item.qty,
                    item_discount : item.item_discount,
                    item_price : item.price,
                    total_item_price : item.item_discount !== 0 ? (item.price * item.qty) - lessDiscount : item.price * item.qty,
                    delivery_id,
                    delivery_status : false,
                    suppliers : [item.supplier],
                    products : [item._id],
                    sold_to : item.sold_to,
                    address : item.address
                }
            }));
            
            return res.status(201).json(deliveries);

        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    deliveryUpdate : async( req,res,next )=>{
        try{
            const {
                id
            } = req.params;
            
            const {delivery,status} = req.body;

            const resDelivery = await DeliveryModel.updateMany({delivery_id : id} , {delivery_status : status});            
            
            if( resDelivery ){
                
                delivery.products.map( async(prod,index)=>{
                    await ProductModel.find({_id : prod.id}, (err,docs)=>{
                        docs.map( async(doc,i)=>{
                            try{                    
                                await ProductModel.updateOne({_id : doc._id},{
                                    item_qty : status ? doc.item_qty + prod.qty : doc.item_qty - prod.qty
                                });
                            }catch(err){
                                return next( createHttpError.Unauthorized({
                                    message : err.message
                                }) );
                            }
                        });
                    });                    
                });                
            }  

            const deliveries = await DeliveryModel.aggregate([
                {'$unwind' : '$products'},                
                {'$unwind' : '$delivery_qty'},
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
                {'$unwind' : '$products'},
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
                    { 'date' : -1 }
                },
            ]);
            
            return res.status(200).json(deliveries);
        }catch(err){
            next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    deliveryDelete : async( req,res,next )=>{
        try{
            const { id } = req.params;

            await DeliveryModel.deleteMany({ delivery_id : id });

            const deliveries = await DeliveryModel.aggregate([
                {'$unwind' : '$products'},                
                {'$unwind' : '$delivery_qty'},
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
                {'$unwind' : '$products'},
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
                    { 'date' : -1 }
                },
            ]);

            return res.status(202).json(deliveries);

        }catch(err){
            return next( createHttpError.Unauthorized({
                message : err.message
            }) );
        }
    },
    deliveryCountMonthly : async(req,res,next)=>{
        try{
            
            const resModel = await DeliveryModel.aggregate([   
                { "$project" :
                    {
                        "year" : { "$year": { "date" : "$createdAt", timezone : "Asia/Manila"} },
                        "month" : { "$month": { "date" : "$createdAt", timezone : "Asia/Manila"} },   
                        "total_expense" : { "$sum" : "$total_item_price" },
                        "id" : "$delivery_id"                                                                                                                   
                    }
                },
                { "$unwind" : "$total_expense" },
                { "$group" : 
                    {
                        "_id" :
                        { 
                            "year" : "$year",
                            "month" : "$month",    
                            "id" : "$id"                     
                        },
                        "total_expense" :
                        {
                            "$sum" : "$total_expense"
                        },
                        "delivery_count" : { "$sum" : 1 }                                            
                    }, 
                },
                { "$group" :
                    {
                        "_id" : {
                            "month" : "$_id.month"
                        },
                        "delivery_count" : { "$sum" : 1 }
                    }
                },
                {
                    "$limit" : 12
                },
                {
                    "$sort" : { "_id.month" : -1 }
                }
            ]);

            return res.status(200).json(resModel);
        }catch(err){
            return createHttpError.Unauthorized({
                message : err.message
            });
        }
    }
}