const { app,BrowserWindow,ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { CmdQueue } = require('cmd-printer');
//const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { networkInterfaces } = require('os');
const net_interface = networkInterfaces();
require('./app/index');

if (require('electron-squirrel-startup')){
    app.quit();
}

let win,loader,printWindow,ipaddr;
    
for( let key in net_interface ){ 
    if( key != 'vEthernet (WSL)' ){                        
        let net_info = net_interface[key];                                                                     
        net_info.map((net_info_interface,i)=>{
            if( net_info[i].internal === false && net_info[i].family === 'IPv4' ){
                ipaddr = net_info[i].address;
            }                
        });
    }     
}

const createWindow = ()=>{

    win = new BrowserWindow({
        width : 1024,
        height : 800,        
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
        },
        autoHideMenuBar : true,
        resizable : false,
        frame : false,
        center : true,
        show : false
    });  
    
    loader = new BrowserWindow({
        width : 450,
        height : 350,
        frame : false,
        resizable : false,
        transparent : true,
        alwaysOnTop : true,
        show : false
    });

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if( process.env.NODE_ENV === "development" ){
        // installExtension(REDUX_DEVTOOLS)
        // .then((name) => console.log(`Added Extension:  ${name}`))
        // .catch((err) => console.log('An error occurred: ', err));
    }

    win.once('ready-to-show',()=>{
        win.show();
    });

    loader.on('closed',()=>{
        loader = null;
    });

    win.on('show',()=>{
        win.minimize();
        win.focus();
    });

    win.on('closed',()=>{
        win = null;
    });
}

app.whenReady().then(()=>{
    createWindow();
});

app.on('window-all-closed',()=>{
    if( process.platform !== 'darwin' ){
        app.quit()
    }
});

app.on('activate',()=>{
    if( BrowserWindow.getAllWindows().length === 0 || win === null ){
        createWindow();
    }
});

ipcMain.handle('printcmd', async(e,args)=>{
    const { data,id,settings } = args;
    const filePath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'..','/renderer/main_window/public/pdfs/') : path.join(__dirname,'../','../','src/pdfs/').replace('app.asar','app.asar.unpacked');            
    const pdfFile = filePath + `${id}.pdf`;
    let cmd = new CmdQueue();

    await fs.writeFileSync(pdfFile, data, {encoding: 'base64'});     
    await cmd.print([pdfFile]);

});

ipcMain.handle('changeDefaultPrinter',(e,args)=>{
    exec(`RUNDLL32 PRINTUI.DLL,PrintUIEntry /y /n "${args}"`,(err,stdout,stderr)=>{
        if( err ) return console.log(err);
    });
});

ipcMain.handle('get-ip',()=>{

    return ipaddr;
});

ipcMain.handle('close',(e, args)=>{
    app.quit()
});


ipcMain.handle('min',(e, args)=>{
    win.minimize();
});