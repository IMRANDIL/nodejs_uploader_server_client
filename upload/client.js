const net = require("net");
const fs = require("fs/promises");
const path = require("path");

// Check if the command-line argument for the file path is provided
if (process.argv.length !== 3) {
  console.error(
    "Please provide the file path that you want to upload! Ex- node client.js example.mp4"
  );
  process.exit(1);
}

const filePath = process.argv[2];

const fileName = path.basename(filePath);

const client = net.createConnection(
  {
    host: "127.0.0.1",
    port: 7000,
  },
  async () => {
    try {
      // Send the file extension as part of the data
      client.write(`fileName:${fileName}-----`);

      const fileHandle = await fs.open(filePath, "r");
      const fileReadStream = fileHandle.createReadStream();

      fileReadStream.on("data", (data) => {
        const canWriteMore = client.write(data);

        if (!canWriteMore) {
          // If the server's buffer is full, pause reading from the file
          fileReadStream.pause();
          client.once("drain", () => {
            // When the server's buffer is drained, resume reading from the file
            fileReadStream.resume();
          });
        }
      });

      fileReadStream.on("end", () => {
        console.log("File has been successfully uploaded!");
        client.end(); // Close the connection when done sending data
      });
    } catch (error) {
      console.error("Error opening file:", error);
      client.end(); // Close the connection on error
    }
  }
);
