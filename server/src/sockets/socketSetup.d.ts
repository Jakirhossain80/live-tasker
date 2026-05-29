import type { Server as HttpServer } from "http";
import socketIo = require("socket.io");
declare const _default: {
    initializeSocket: (server: HttpServer) => socketIo.Server<socketIo.DefaultEventsMap, socketIo.DefaultEventsMap, socketIo.DefaultEventsMap, any>;
};
export = _default;
//# sourceMappingURL=socketSetup.d.ts.map