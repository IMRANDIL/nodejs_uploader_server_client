const net = require("net");
const fs = require("fs/promises");
const server = net.createServer(() => {});

server.on("connection", async (socket) => {
  console.log("new connection");

  try {
    const fileHandle = await fs.open(`storage/upload.txt`, "w");
    const fileWriteStream = fileHandle.createWriteStream();

    socket.on("data", (data) => {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }

      fileWriteStream.once('drain', () => {
        socket.resume();
      });
    });

    socket.on("end", () => {
      console.log("connection ended");
      fileWriteStream.end(() => {
        fileHandle.close().then(() => {
          console.log('File handle closed.');
        }).catch((err) => {
          console.error('Error closing file handle:', err);
        });
      });
    });
  } catch (error) {
    console.error('Error opening file:', error);
  }
});

server.listen(7000, "127.0.0.1", () => {
  console.log(`upload server started on:`, server.address());
});
