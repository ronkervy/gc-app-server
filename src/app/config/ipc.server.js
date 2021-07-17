const ipc = require('node-ipc');
const ip = require('ip');
const name = ip.address().split('.')[3];
const { networkInterfaces } = require('os');

ipc.config.id = 'gc-server';
ipc.config.retry= 1500;

const net_interface = networkInterfaces();
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

ipc.serveNet(
    'udp4',
    ()=>{

        ipc.server.on(
            'FindServer',
            function(data,socket){
                ipc.log('Server Replied : ', data.id ,' : ', data.message);                
                ipc.server.emit(
                    socket,
                    'client-connected',
                    {
                        ipadd : ipaddr,
                        message : "Connected to server.",                        
                    }
                );
            }
        );

        ipc.server.broadcast({
            address : 'localhost',
            port : ipc.config.networkPort
        },
        'ServerBroadcast',
        {
            ipadd : ipaddr,
            id : ipc.config.id,
            message : 'Server reply @ ' + new Date(Date.now()).toISOString().split('T')[0]
        });
    }
);


module.exports = ipc;