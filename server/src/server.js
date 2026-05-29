"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketSetup = require("./sockets/socketSetup");
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
//# sourceMappingURL=server.js.map