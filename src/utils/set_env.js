require("dotenv").config();
const { readFile, writeFile } = require("fs");
const { join } = require("path");
const { getIpAddress } = require("./ip_address");

const filename = join(__dirname, "../../.env");
const ip_address = getIpAddress();
const newHostValue = `HOST=${ip_address}`;

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

    writeFile(filename, lines.join("\n"), (error) => {
      if (error) throw error;
      console.log("> Successfully updated .env variables ✅");
    });
  }
);
