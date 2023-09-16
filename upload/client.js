const net = require("net");
const fs = require("fs/promises");

const client = net.createConnection(
  {
    host: "127.0.0.1",
    port: 7000,
  },
  async () => {
    const fileHandle = await fs.open("./test.txt", "r");
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.on("data", (data) => {
      client.write(data)
    });

    
    fileReadStream.on('end', ()=>{
        console.log('file has successfully uploaded!');
         client.end()
    })

  }
);
