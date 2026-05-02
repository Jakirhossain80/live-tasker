import type { Server } from "socket.io";
import socketRooms = require("./socketRooms");

let io: Server | null = null;

const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

const getSocketServer = () => {
  return io;
};

const emitToWorkspaceAndBoard = (
  workspaceId: string,
  boardId: string,
  eventName: string,
  payload: unknown,
) => {
  if (!io) {
    return;
  }

  io.to(socketRooms.getWorkspaceRoom(workspaceId))
    .to(socketRooms.getBoardRoom(boardId))
    .emit(eventName, payload);
};

const getDocumentId = (value: any) => {
  return String(value?._id ?? value);
};

const emitTaskCreated = (task: any) => {
  emitToWorkspaceAndBoard(
    getDocumentId(task.workspace),
    getDocumentId(task.board),
    "taskCreated",
    { task },
  );
};

const emitTaskUpdated = (task: any) => {
  emitToWorkspaceAndBoard(
    getDocumentId(task.workspace),
    getDocumentId(task.board),
    "taskUpdated",
    { task },
  );
};

const emitTaskMoved = (task: any) => {
  emitToWorkspaceAndBoard(
    getDocumentId(task.workspace),
    getDocumentId(task.board),
    "taskMoved",
    { task },
  );
};

const emitTaskDeleted = (payload: {
  taskId: string;
  workspaceId: string;
  boardId: string;
}) => {
  emitToWorkspaceAndBoard(
    payload.workspaceId,
    payload.boardId,
    "taskDeleted",
    payload,
  );
};

const emitCommentAdded = (comment: any) => {
  const task = comment.task;

  emitToWorkspaceAndBoard(
    getDocumentId(task.workspace),
    getDocumentId(task.board),
    "commentAdded",
    { comment },
  );
};

export = {
  setSocketServer,
  getSocketServer,
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskMoved,
  emitTaskDeleted,
  emitCommentAdded,
};
