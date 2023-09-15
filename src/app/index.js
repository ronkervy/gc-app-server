const app = require('express')();
const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api.routes');
const helmet = require('helmet');
const createHttpError = require('http-errors');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors : {
        methods : ['POST','PATCH','PUT','DELETE'],
        origin : "*",
        methods: [PUT,PATCH,OPTIONS]
    }
});
const PORT = process.env.PORT || 8081;
const fs = require('fs');
const { CmdQueue } = require('cmd-printer');
const axios = require('axios');
const pdfium = require('node-pdfium');

app.use(helmet());
app.use(cors());
app.use('/static',express.static(path.join(__dirname,'../renderer/main_window/public')));
app.use(express.static(path.join(__dirname,'..','/renderer/main_window/public')));
app.use(express.json({ limit : '200mb' }));
app.use(express.urlencoded({ extended : false,limit : '200mb' }));

app.use('/api/v1',apiRoutes);

app.use('/loader',(req,res,next)=>{
    res.status(200).sendFile(path.resolve(__dirname,'../renderer/main_window/public/loader.html'));
});

app.use('/',(req,res)=>{
    res.status(302).redirect('http://localhost:3000/main_window');
});

app.use((req,res,next)=>{
    next(createHttpError.NotFound());
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error : {
            status : err.status,
            message : err.message
        }
    });
});

io.on("connection",(socket)=>{
    const addr = socket.request.connection.remoteAddress;
    const settingsServices = axios.create({
        baseURL : "http://localhost:8081/api/v1/settings"
    });
    
    socket.on('default-printer',(printer)=>{
        socket.broadcast.emit('server-printer',printer);
    });

    socket.on('printcmd', async(args)=>{
        try{
            const resSettings = await settingsServices({
                method : "GET"
            });

            const { settings } = resSettings.data;

            const { data,id,sid } = args;
            const filePath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'..','/renderer/main_window/public/pdfs/') : path.join(__dirname,'../','../','src/pdfs/').replace('app.asar','app.asar.unpacked');    
            const pdf2printer = process.env.NODE_ENV === 'development' ? path.join(__dirname,'..','/renderer/main_window/native_modules/') : path.join(__dirname,'../','../','src/native_modules/').replace('app.asar','app.asar.unpacked');        
            const pdfFile = filePath + `${id}.pdf`;

            let cmd = new CmdQueue({
                ...settings.printer.options,
                paperSize : "Receipt"                
            });

            io.to(sid).emit("print-status",{
                printStatus : true,
            });       

            await fs.writeFileSync(pdfFile, data, {encoding: 'base64'});   
            pdfium.printPDF({
                printerName : `${settings.printer.default}`,
                filePath : pdfFile,
                dpi : settings.printer.dpi,
                height : settings.printer.height * settings.printer.dpi,
                width : settings.printer.width * settings.printer.dpi
            });
            // await cmd.print([pdfFile]);            
            // NodePdfPrinter.printFiles([pdfFile],"",pdf2printer);            
            io.emit("print-status",{
                printStatus : false
            });
        }catch(err){
            return createHttpError.InternalServerError({
                message : err
            })
        }
    });

    socket.on("client",client=>{
        
        console.log({
            ...client,
            address : addr,
            id : socket.id
        });
        
        socket.emit('client_connected',{
            status : true
        });
        
    });

    socket.on("updated_product",res=>{
        socket.local.emit("updated_product");
    });

    socket.on("created_product",res=>{
        socket.local.emit("created_product");
    });

    socket.on("deleted_product",res=>{
        socket.local.emit("deleted_product");
    });
    
});

http.listen(PORT);