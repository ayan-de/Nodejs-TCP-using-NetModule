const { rejects } = require("assert");
const net = require("net");
const { resolve } = require("path");
const readLine = require("readline/promises");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, rejects) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

//create client/socket
const socket = net.createConnection(
  { host: "127.0.0.1", port: 4000 },
  async () => {
    console.log(`Connected to server!`);

    const ask = async () => {
      const message = await rl.question(`Enter the message > `);
      // move the cursor one line up
      await moveCursor(0, -1);
      //clear the current line that the cursor is in
      await clearLine(0);

      socket.write(`${id}-message-${message}`);
    };

    ask();

    socket.on("data", async (data) => {
      // log an empty line
      console.log();
      // move the cursor one line up
      await moveCursor(0, -1);
      // clear that line that the cursor just moved into
      await clearLine(0);

      if (data.toString("utf-8").substring(0, 2) === "id") {
        //When we are getting the id...

        //everything from the third character up until the end
        id = data.toString("utf-8").substring(3);

        console.log(`Your id is ${id}!\n`);
      } else {
        //When we are getting the message...

        console.log(data.toString("utf-8"));
      }

      ask();
    });
  }
);

socket.on("end", () => {
  console.log(`Connection was ended so siging off`);
});
