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
        origin : "*"
    }
});
const PORT = process.env.PORT || 8081;
const ipc = require('./config/ipc.server');

app.use(helmet());
app.use(cors("*"));
app.use(express.static(path.join(__dirname,'..','/renderer/main_window/public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use('/api/v1',apiRoutes);
app.use('/',(req,res)=>{
    res.redirect('http://localhost:3000/main_window');
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

http.listen(PORT,()=>{
    ipc.server.start();
    io.on("connection",(socket)=>{
        const addr = socket.request.connection.remoteAddress;

        socket.on("ping",()=>{
            const s = new Date().toLocaleString();            
            setTimeout(()=>{  
                io.local.emit("pong",{
                    message : 'Server Replies @ ' + s,
                    status : true
                });
            },3000);
        });
    
        socket.on("client",client=>{
            console.log({
                ...client,
                address : addr,
                id : socket.id
            });
            setTimeout(()=>{
                socket.emit('client_connected',{
                    status : true
                });
            },3000);
        });

        socket.on("updated_product",res=>{
            setTimeout(()=>{
                socket.local.emit("updated_product");
            },2000);
        });

        socket.on("created_product",res=>{
            setTimeout(()=>{
                socket.local.emit("created_product");
            },2000);
        });
    
        socket.on("created_product",res=>{
           setTimeout(()=>{
                socket.local.emit("created_product");
           },2000);
        });
    
        socket.on("updated_product",res=>{
            setTimeout(()=>{
                socket.local.emit("updated_product");
            },2000);
        });
    });
});