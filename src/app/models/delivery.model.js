const { Schema,Types } = require('mongoose');
const db = require('../config/db.config');
const ProductModel = require('../models/product.model');
const SupplierModel = require('../models/supplier.model');
const moment = require('moment-timezone');
const phTime = moment.tz(Date.now(),"Asia/Manila");

const DeliverySchema = new Schema({
    sold_to : {
        type : String
    },
    delivery_address : {
        type : String
    },
    delivery_id : {
        type : String
    },
    item_price : {
        type : Number,
        default : 0
    },
    item_discount : {
        type : Number,
        default : 0
    },
    total_item_price : {
        type : Number,
        default : 0
    },
    delivery_qty : {
        type : Number,
        default : 1
    },
    delivery_status : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : phTime
    },
    products : [{
        type : Types.ObjectId,
        ref : 'Product'
    }],
    suppliers : [{
        type : Types.ObjectId,
        ref : 'Supplier'
    }]
},{timestamps : true });

DeliverySchema.pre('save',async function(next){
    this.createdAt = phTime;
    next();
});

DeliverySchema.pre('deleteMany',async function(){
    const docs = await this.model.find(this.getQuery());
    
    docs.map((doc)=>{   
        doc.products.map( async(prod,index)=>{
            try{
                await ProductModel.updateOne({
                    _id : prod._id
                },
                {
                    '$pull' : { 'deliveries' : doc._id },
                },
                {
                    'multi' : true
                });
                
            }catch(err){
                throw new Error(err);
            }
        })

        doc.suppliers.map( async(supp,index)=>{
            try{
                await SupplierModel.updateOne({
                    _id : supp._id
                },
                {
                    '$pull' : { 'deliveries' : doc._id },
                },
                {
                    'multi' : true
                });
                
            }catch(err){
                throw new Error(err);
            }
        });
    });
});

module.exports = db.model('Delivery',DeliverySchema);