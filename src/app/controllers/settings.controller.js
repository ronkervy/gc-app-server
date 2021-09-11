const createHttpError = require('http-errors');
const path = require('path');
const fs = require('fs');

module.exports = {
    getSettings : async(req,res,next)=>{
        try{
            const filePath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'../renderer/main_window','/config/default.json') : path.join(__dirname,'../../','/config/default.json').replace('app.asar','app.asar.unpacked');
            const rawFile = await fs.promises.readFile(filePath);
            const settingsJSON = JSON.parse(rawFile);
            return res.status(200).json(settingsJSON);
        }catch(err){
            return next( createHttpError.InternalServerError({
                message : err.message
            }) );
        }
    },
    setDefaultPrinter : async(req,res,next)=>{
        try{
            const filePath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'../renderer/main_window','/config/default.json') : path.join(__dirname,'../../','/config/default.json').replace('app.asar','app.asar.unpacked');
            console.log(process.env.NODE_ENV + ' : ',filePath);
            const rawFile = await fs.promises.readFile(filePath);
            const settingsJSON = JSON.parse(rawFile);
            const { default_printer } = req.body;            
            settingsJSON.settings.printer.default = default_printer;
            let settingsSTR = JSON.stringify(settingsJSON,null,2);
            await fs.promises.writeFile(filePath,settingsSTR);

            return res.status(200).json(settingsJSON);

        }catch(err){
            return next(createHttpError.InternalServerError({
                message : err.message
            }));
        }
    },
    saveSettings : async(req,res,next)=>{
        try{
            const filePath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'../renderer/main_window','/config/default.json') : path.join(__dirname,'../../','/config/default.json').replace('app.asar','app.asar.unpacked');
            const rawFile = await fs.promises.readFile(filePath);
            const settingsJSON = JSON.parse(rawFile);            
            settingsJSON.settings.printer.list = [];
            const { printer } = req.body;
            settingsJSON.settings.printer.default = printer.default !== '' || printer.default !== undefined ? printer.default : settingsJSON.settings.printer.default;
            if( printer.list !== undefined ){
                printer.list.map(prntr=>{         
                    settingsJSON.settings.printer.list.push(prntr);
                });
            }                        
            let settingsSTR = JSON.stringify(settingsJSON,null,2);
            await fs.promises.writeFile(filePath,settingsSTR);

            return res.status(200).json(settingsJSON);

        }catch(err){
            return next(createHttpError.InternalServerError({
                message : err.message
            }));
        }
    }
}