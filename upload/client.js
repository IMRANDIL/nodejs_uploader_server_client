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
      // Send each chunk of data to the server
      if (!client.write(data)) {
        // If the server's buffer is full, pause reading from the file
        fileReadStream.pause();
      }
    });

    client.on("drain", () => {
      // When the server's buffer is drained, resume reading from the file
      fileReadStream.resume();
    });

    fileReadStream.on('end', () => {
      console.log('File has been successfully uploaded!');
      client.end(); // Close the connection when done sending data
    });
  }
);
