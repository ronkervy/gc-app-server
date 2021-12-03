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
            const { printer,number } = req.body;

            settingsJSON.settings.printer.default = printer.default !== '' || printer.default !== undefined ? printer.default : settingsJSON.settings.printer.default;
            settingsJSON.settings.printer.dpi = printer.dpi !== '' || printer.dpi !== undefined ? parseInt(printer.dpi) : parseInt(settingsJSON.settings.printer.dpi);
            settingsJSON.settings.printer.width = printer.width !== '' || printer.width !== undefined ? parseFloat(printer.width) : parseFloat(settingsJSON.settings.printer.width);
            settingsJSON.settings.printer.height = printer.height !== '' || printer.height !== undefined ? parseFloat(printer.height) : parseFloat(settingsJSON.settings.printer.height);
            settingsJSON.settings.printer.options = printer.options;
            settingsJSON.settings.number = number !== '' || number !== undefined ? number : "";
            
            
            settingsJSON.settings.printer.list = [...printer.list]                   
            
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