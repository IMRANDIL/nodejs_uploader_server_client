const net = require("net");
const fs = require("fs/promises");
const server = net.createServer(() => {});

server.on("connection", async (socket) => {
  console.log("new connection");

  try {
    // You can keep the file name as provided by the client or generate a unique name.
    // In this example, we'll keep the original file name sent by the client.
    const fileName = `storage/upload_${Date.now()}.bin`; // You can generate a unique name or use the original name

    const fileHandle = await fs.open(fileName, "w"); // Open the file for writing
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
