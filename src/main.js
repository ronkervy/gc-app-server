const { app,BrowserWindow,ipcMain } = require('electron');
// const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const { networkInterfaces } = require('os');
const net_interface = networkInterfaces();
require('./app/index');

if (require('electron-squirrel-startup')){
    app.quit();
}

let win;
let ipaddr;
    
for( let key in net_interface ){ 
    if( key != 'vEthernet (WSL)' ){                        
        let net_info = net_interface[key];                                                                     
        net_info.map((net_info_interface,i)=>{
            if( key == 'Wi-Fi' || key == 'Ethernet' ){
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
            devTools : true
        },
        autoHideMenuBar : true,
        resizable : false,
        frame : false,
        center : true,
        show : false
    });
    
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if( process.env.NODE_ENV === "development" ){
        win.webContents.openDevTools();
        // installExtension(REDUX_DEVTOOLS)
        //     .then((name) => console.log(`Added Extension:  ${name}`))
        //     .catch((err) => console.log('An error occurred: ', err));
    }

    win.webContents.on('dom-ready',()=>{        
        win.webContents.send('get-ip',ipaddr);        
    });

    win.once('ready-to-show',()=>{
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

ipcMain.handle('close',(e, args)=>{
    app.quit()
});


ipcMain.handle('min',(e, args)=>{
    win.minimize();
});