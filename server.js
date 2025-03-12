// const net = require("net");
import net from "net";

const PORT = 4000;
// const HOST = "172.31.4.28";

const HOST = "127.0.0.1";
//create server
//one such socket object for every client
const server = net.createServer();

//array of client sockets
//storing each socket of every client
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
    //convert data from client to string
    const dataString = data.toString("utf-8");
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);
    //writing in every socket/client
    client.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  client.push({ id: clientId.toString(), socket });
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on the`, server.address());
});
