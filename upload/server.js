const net = require("net");
const fs = require("fs/promises");
const server = net.createServer(() => {});

let fileHandle, fileWriteStream;

server.on("connection", (socket) => {
  console.log("new connection");

  socket.on("data", async (data) => {
    if (!fileHandle) {
      fileHandle = await fs.open(`storage/upload.txt`, "w");
      fileWriteStream = fileHandle.createWriteStream();

      fileWriteStream.write(data);

      fileWriteStream.on('finish', () => {
        fileHandle.close().then(() => {
          fileHandle = undefined;
          fileWriteStream = undefined;
          console.log('File handle closed.');
        }).catch((err) => {
          console.error('Error closing file handle:', err);
        });
      });
    } else {
      fileWriteStream.write(data);
    }
  });

  socket.on("end", () => {
    console.log("connection ended");
  });
});

server.listen(7000, "127.0.0.1", () => {
  console.log(`upload server started on:`, server.address());
});
