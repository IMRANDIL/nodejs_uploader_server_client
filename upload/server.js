const net = require('net');

const server = net.createServer();

server.on('connection', (socket)=>{
    socket.on('data', (data)=>{
        console.log(data.toString('utf-8'));
        socket.write(data)
    })
})







server.listen(7000, "127.0.0.1", ()=>{
    console.log(`upload server started on:`, server.address())
})