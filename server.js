const net = require("net");

//create server
const server = net.createServer();

//array of client sockets
const client = [];

//socket(Stream) means endpoint - to read and send info to the socket
server.on("connection", (socket) => {
  console.log(`A new client has connected to the server`);

  const clientId = client.length + 1;

  //Broadcasting a message to everyone when someone joins the chat room
  client.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  //Broadcasting a message to everyone when someone leaves the chat room
  socket.on("end", () => {
    client.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    client.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  client.push({ id: clientId.toString(), socket });
});

server.listen(4000, "127.0.0.1", () => {
  console.log(`Listening on the`, server.address());
});
