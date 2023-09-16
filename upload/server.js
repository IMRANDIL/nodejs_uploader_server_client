const net = require("net");
const fs = require("fs/promises");
const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("new connection");

  socket.on("data", async (data) => {
    const fileHandle = await fs.open(`storage/upload.txt`, "w");
    const fileWriteStream = fileHandle.createWriteStream();
    if (!fileWriteStream.write(data)) {
      socket.pause();
    }
    socket.resume();
    fileWriteStream.write(data);
  });
});

server.listen(7000, "127.0.0.1", () => {
  console.log(`upload server started on:`, server.address());
});
