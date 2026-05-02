import dotenv = require("dotenv");
import http = require("http");
import app = require("./app");
import connectDB = require("./config/db");
import socketSetup = require("./sockets/socketSetup");

dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);

socketSetup.initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`LiveTasker API is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
