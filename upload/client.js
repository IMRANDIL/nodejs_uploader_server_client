const net = require('net');

const client = net.createConnection({
    host: '127.0.0.1',
    port: 7000
});
client.write('hey ali what is up?');

client.on('data', (data)=>{
   
    console.log(data.toString('utf-8'));
    client.end()
})


