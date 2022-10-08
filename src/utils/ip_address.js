const networks = require("os").networkInterfaces();

exports.getIpAddress = () => {
  for (const key of Object.keys(networks)) {
    if (key === "Wi-Fi") {
      for (const network of networks[key]) {
        const family4Value = typeof network.family === "string" ? "IPv4" : 4;
        if (network.family === family4Value && !network.internal) {
          return network.address;
        }
      }
    }
  }
};
