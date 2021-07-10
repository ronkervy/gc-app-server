const { app,BrowserWindow,ipcMain } = require('electron');
const exec = require('child_process').exec;
const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const path = require('path');
const server = require('./app/index');
const ip = require('ip');
const { networkInterfaces } = require('os');
const net_interface = networkInterfaces();

if (require('electron-squirrel-startup')){
  app.quit();
}

let win;

const createWindow = ()=>{
    win = new BrowserWindow({
        width : 1024,
        height : 800,        
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
            preload : server
        },
        autoHideMenuBar : true,
        resizable : false,
        frame : false,
    });

    win.webContents.openDevTools();
    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    win.on('closed',()=>{
        win = null;
    });
}

app.whenReady().then(()=>{

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

    const execute = (cmd,cb)=>{
        exec(cmd,(error,stdout,stderr)=>{
            if(error) return cb(stderr);
            return cb(stdout);
        });
    }
    
    execute(`setx REACT_APP_HOST "${ipaddr}"`,(result)=>{
        console.log(result);
        createWindow();
    });
    
    installExtension(REDUX_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));    
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