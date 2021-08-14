const { Schema,Types } = require('mongoose');
const db = require('../config/db.config');
const { v4 : uuidV4 } = require('uuid');
const moment = require('moment-timezone');
const phTime = moment.tz(Date.now(),"Asia/Manila");

const SupplierSchema = new Schema({
    supplier_id : {
        type : String
    },
    supplier_name : {
        type : String,
        required : true,
        unique : true
    },
    supplier_contact : {
        type : String
    },
    supplier_email : {
        type : String
    },
    supplier_address : {
        type : String
    },
    supplier_memo : {
        type : String
    },
    createdAt : {
        type : Date,
        default : phTime
    },
    products : [{
        type : Types.ObjectId,
        ref : 'Product'
    }],
    deliveries : [{
        type : Types.ObjectId,
        ref : 'Delivery'
    }]
},{ timestamps : true });

SupplierSchema.pre('save',function(next){
    const id = uuidV4();
    this.supplier_id = id;
    next();
});

module.exports = db.model('Supplier',SupplierSchema);