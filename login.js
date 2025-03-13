import { input, password } from "@inquirer/prompts";
import { connectToServer } from "./client.js";

const validCredentials = {
  username: "admin",
  password: "1234",
  email: "admin@gmail.com",
};

// export async function Login() {
const username = await input({ message: "Enter your username" });
const passcode = await password({
  message: "Enter your password",
  mask: true,
});

if (
  username === validCredentials.username &&
  passcode === validCredentials.password
) {
  console.log("Login successful! Establishing connection...");
  connectToServer(); // Call the connection function from client.js
} else {
  console.log("Enter valid credentials.");
}
// }
