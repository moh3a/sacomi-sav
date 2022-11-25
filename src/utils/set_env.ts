import { config } from "dotenv";
config();
import { readFile, writeFile } from "fs";
import { join } from "path";
import getIpAddress from "./ip_address";

const filename = join(__dirname, "../.env");
const is_local = process.env.WORK_ENV === "local";
const is_prod = process.env.NODE_ENV === "production";
const ip_address = is_local ? getIpAddress() : "localhost";
const newHostValue = `HOST=${ip_address}`;
const newNAValue = `NEXTAUTH_URL=http://${ip_address}:3000`;
const newWSValue = `WS_URL=ws://${ip_address}:${is_prod ? 3000 : 3001}`;

readFile(
  filename,
  {
    encoding: "utf8",
  },
  (error, data) => {
    if (error) throw error;
    let lines = data.split("\n");

    const h_index = lines.findIndex((line) => line.includes("HOST"));
    if (h_index === -1) lines.push(newHostValue);
    else lines[h_index] = newHostValue;

    const na_index = lines.findIndex((line) => line.includes("NEXTAUTH_URL"));
    if (na_index === -1) lines.push(newNAValue);
    else lines[na_index] = newNAValue;

    const ws_index = lines.findIndex((line) => line.includes("WS_URL"));
    if (ws_index === -1) lines.push(newWSValue);
    else lines[ws_index] = newWSValue;

    writeFile(filename, lines.join("\n"), (error) => {
      if (error) throw error;
      console.log("> Successfully updated .env variables ✅");
    });
  }
);
