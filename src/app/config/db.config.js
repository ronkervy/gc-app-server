const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost',{
    dbName : "gc_db",
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
}).then(()=>{
    console.log("Connected to the database.");
}).catch((err)=>{
    console.log(err);
});

const db = mongoose.connection;

module.exports = db;