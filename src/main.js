const { app,BrowserWindow,ipcMain,screen } = require('electron');
const { exec } = require('child_process');
const { networkInterfaces } = require('os');
const net_interface = networkInterfaces();
require('./app/index');
const path = require('path');
const axios = require('axios');

if (require('electron-squirrel-startup')){
    app.quit();
}

let win,loader,ipaddr;
    
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

const SettingsServices = axios.create({
    baseURL : "http://localhost:8081/api/v1/settings",
    timeout : 1000
});

const setPrinters = async(printerList)=>{
    try{
        const resSettings = await SettingsServices({
            method : "GET"
        });
    
        const { settings } = resSettings.data;
    
        await SettingsServices({
            method : "POST",
            data : {
                ...settings,
                printer : {
                    ...settings.printer,
                    list : [...printerList]
                }
            }
        });
    }catch(err){
        console.log(err);
    }   
};

const createWindow = ()=>{

    const factor = screen.getPrimaryDisplay().scaleFactor;

    win = new BrowserWindow({
        width : 1024 / factor,
        height : 720 / factor,
        backgroundColor : '#fff',
        webPreferences : {
            zoomFactor : 0.9,
            nodeIntegration : true,            
            contextIsolation : false,
            devTools : true
        },
        resizable : false,
        frame : false,
        center : true,
        show : false,
        icon : path.resolve(__dirname,'../renderer/main_window/','public/img/logo.ico')
    });  

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if( process.env.NODE_ENV === "development" ){
        const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
        installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }    

    win.webContents.once('dom-ready',()=>{
        let printers = win.webContents.getPrinters();
        const printerArr = [];
        
        printers.map((printer,i)=>{
            printerArr.push(printers[i].name);
        });
        
        setPrinters(printerArr);
    });            

    win.once('ready-to-show',()=>{
        win.webContents.setZoomFactor(0.9);
        win.minimize();
        win.show();
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