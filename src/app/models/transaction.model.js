const { Schema,Types } = require('mongoose');
const db = require('../config/db.config');

const TransactionSchema = new Schema({
    transact_id : String,
    customer_name : String,
    transact_payment_type : {
        type : String,
        default : 'full'
    },
    cash_amount : {
        type : Number,
        default : 0
    },
    change_amount : {
        type : Number,
        default : 0
    },
    total_amount : {
        type : Number,
        default : 0
    },
    item_current_price : {
        type : Number,
        default : 0
    },
    partial_payments : [{
        type : Number,
        default : 0
    }],
    transact_status : {
        type : Boolean,
        default : true
    },
    total_per_unit : {
        type : Number,
        default : 0
    },
    discount : {
        type : Number,
        default : 0
    },
    qty : Number,
    product : {
        type : Types.ObjectId,
        ref : "Product"
    }
},{ timestamps : true});

module.exports = db.model('Transaction',TransactionSchema); 