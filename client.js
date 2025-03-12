// const { rejects } = require("assert");
// const net = require("net");
// const { resolve } = require("path");
// const readLine = require("readline/promises");

import net from "net";
import readLine from "readline/promises";

const PORT = 4000;
//const HOST = "3.110.218.75";
// const HOST = "13.233.251.235";
// const HOST = "13.201.128.224";
const HOST = "127.0.0.1";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//dir means direction
const clearLine = (dir) => {
  return new Promise((resolve, rejects) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

//dir means direction
const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

let id;

//create client/socket
const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log(`Connected to server!`);

  console.log(`
    _____                             _        __  __       _ _ 
   | ____|_ __   ___ _ __ _   _ _ __ | |_ ___ |  \\/  | __ _(_) |
   |  _| | '_ \\ / __| '__| | | | '_ \\| __/ _ \\| |\\/| |/ _\` | | |
   | |___| | | | (__| |  | |_| | |_) | || (_) | |  | | (_| | | |
   |_____|_| |_|\\___|_|   \\__, | .__/ \\__\\___/|_|  |_|\\__,_|_|_|
                          |___/|_|                               

          End-to-End Encrypted Backup E-mailing Service!
  `);

  //'connect' listener.
  //console.log("connected to server!");
  //ask function to ask quesuion call this everytime after user
  //input ends
  const ask = async () => {
    const message = await rl.question(`Enter the message > `);
    // move the cursor one line up
    await moveCursor(0, -1);
    //clear the current line that the cursor is in
    await clearLine(0);
    //from client to server the message is tranfering in the form
    //"2-message-the message here"
    socket.write(`${id}-message-${message}`);
  };

  ask();

  //while we get data from user we first move the cursor to the above line
  //then we clear that line and put that message there
  //then the ask() function ask to enter the message
  socket.on("data", async (data) => {
    //when we are getting the message (data)
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
});

socket.on("end", () => {
  console.log(`Connection was ended so siging off`);
});
