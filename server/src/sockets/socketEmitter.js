"use strict";
const socketRooms = require("./socketRooms");
let io = null;
const setSocketServer = (socketServer) => {
    io = socketServer;
};
const getSocketServer = () => {
    return io;
};
const emitToWorkspaceAndBoard = (workspaceId, boardId, eventName, payload) => {
    if (!io) {
        return;
    }
    io.to(socketRooms.getWorkspaceRoom(workspaceId))
        .to(socketRooms.getBoardRoom(boardId))
        .emit(eventName, payload);
};
const getDocumentId = (value) => {
    return String(value?._id ?? value);
};
const emitTaskCreated = (task) => {
    emitToWorkspaceAndBoard(getDocumentId(task.workspace), getDocumentId(task.board), "taskCreated", { task });
};
const emitTaskUpdated = (task) => {
    emitToWorkspaceAndBoard(getDocumentId(task.workspace), getDocumentId(task.board), "taskUpdated", { task });
};
const emitTaskMoved = (task) => {
    emitToWorkspaceAndBoard(getDocumentId(task.workspace), getDocumentId(task.board), "taskMoved", { task });
};
const emitTaskDeleted = (payload) => {
    emitToWorkspaceAndBoard(payload.workspaceId, payload.boardId, "taskDeleted", payload);
};
const emitCommentAdded = (comment) => {
    const task = comment.task;
    emitToWorkspaceAndBoard(getDocumentId(task.workspace), getDocumentId(task.board), "commentAdded", { comment });
};
module.exports = {
    setSocketServer,
    getSocketServer,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskMoved,
    emitTaskDeleted,
    emitCommentAdded,
};
//# sourceMappingURL=socketEmitter.js.map