const { Schema,Types } = require('mongoose');
const db = require('../config/db.config');
const { v4 : uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const phTime = moment.tz(Date.now(),"Asia/Manila");

const ProductSchema = new Schema({
    item_id : {
        type : String,
        unique : true
    }, 
    item_name : {
        type : String,
        required : true
    },    
    item_price : {
        type : Number,
        required : true
    },
    item_selling_price : {
        type : Number,
        required : true
    },
    item_desc : {
        type : String
    },
    item_unit : {
        type : String
    },
    item_qty : {
        type : Number
    },
    item_supplier : {
        type : String
    },
    item_visible : {
        type : Boolean,
        default : true
    },
    item_code : {
        type : String
    },
    prod_prev_qty : {
        type : Number
    },
    createdAt : {
        type : Date,
        default : phTime
    },
    suppliers : [{
        type : Types.ObjectId,
        ref : "Supplier"
    }],
    transactions : [{
        type : Types.ObjectId,
        ref : "Transaction"
    }],
    deliveries : [{
        type : Types.ObjectId,
        ref : "Delivery"
    }]
},{ timestamps : true });

ProductSchema.pre('save',function( next ){    
    if( this.isNew ){
        const id = uuidv4();
        this.item_id = id;
    }
    next();
});

ProductSchema.pre('updateOne',{document : true}, async function( next ){
    const docToUpdate = await this.model.findOne(this.getQuery());
    this.set({ prod_prev_qty : docToUpdate.item_qty });
    next();
});

module.exports = db.model('Product',ProductSchema);