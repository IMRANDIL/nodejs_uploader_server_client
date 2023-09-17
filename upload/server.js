const net = require("net");
const fs = require("fs/promises");
const server = net.createServer(() => {});

server.on("connection", async (socket) => {
  console.log("new connection");
  let fileHandle, fileWriteStream;
  let fileName, indexDivider; // Define fileName here

  socket.on("data", async (data) => {
    if (!fileName) {
      indexDivider = data.indexOf('-----');
      if (indexDivider !== -1) {
        console.log(indexDivider);
        fileName = data.subarray(9, indexDivider).toString();
        fileHandle = await fs.open(`storage/${fileName}`, "w"); // Open the file for writing
        fileWriteStream = fileHandle.createWriteStream();
        
        // Adjust the index to start copying data after the "-----" delimiter
        data = data.subarray(indexDivider + 5);
      }
    }

    if (fileWriteStream && indexDivider !== -1) {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }

      fileWriteStream.once('drain', () => {
        socket.resume();
      });
    }
  });

  socket.on("end", () => {
    console.log("connection ended");
    if (fileWriteStream) {
      fileWriteStream.end(() => {
        fileHandle.close().then(() => {
          console.log('File handle closed.');
        }).catch((err) => {
          console.error('Error closing file handle:', err);
        });
      });
    }
  });
});

server.listen(7000, "127.0.0.1", () => {
  console.log(`upload server started on:`, server.address());
});
