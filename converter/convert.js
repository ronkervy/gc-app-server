const fs = require('fs');
const path = require('path');

const convertJSON = async()=>{
    try{
        const stockJSON = require('./stock.json'); 
        stockJSON.map(async(product)=>{
            try{
                if( product.suppliers === undefined ){
                    product.suppliers = [{"$oid":""}];
                }
                else{
                    product.suppliers = [{"$oid":`${product.suppliers}`}];                
                }    
                let stockSTR = JSON.stringify(stockJSON,null,2);
                await fs.promises.writeFile(path.resolve(__dirname,'stock.json'),stockSTR);        
            }catch(err){
                console.log(err);
            }
        });
    }catch(err){
        console.log(err);
    }
}

convertJSON();