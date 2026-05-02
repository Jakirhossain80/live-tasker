import type { Server as HttpServer } from "http";
import mongoose = require("mongoose");
import socketIo = require("socket.io");
import authService = require("../services/authService");
import Board = require("../models/Board");
import Workspace = require("../models/Workspace");
import socketEmitter = require("./socketEmitter");
import socketRooms = require("./socketRooms");

const getTokenFromHandshake = (socket: any) => {
  const authToken = socket.handshake.auth?.token;

  if (typeof authToken === "string" && authToken.trim().length > 0) {
    const token = authToken.trim();

    return token.startsWith("Bearer ")
      ? token.slice("Bearer ".length).trim()
      : token;
  }

  const authorizationHeader = socket.handshake.headers.authorization;

  if (
    typeof authorizationHeader === "string" &&
    authorizationHeader.startsWith("Bearer ")
  ) {
    return authorizationHeader.slice("Bearer ".length).trim();
  }

  return null;
};

const isWorkspaceMember = (workspace: any, userId: string) => {
  return workspace.members.some((member: any) => String(member.user) === userId);
};

const getIdFromPayload = (payload: unknown, key: string) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    const value = (payload as Record<string, unknown>)[key];

    if (typeof value === "string") {
      return value;
    }
  }

  return null;
};

const joinWorkspace = async (
  socket: any,
  payload: unknown,
  callback?: (response: unknown) => void,
) => {
  const workspaceId = getIdFromPayload(payload, "workspaceId");

  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    callback?.({ success: false, message: "Valid workspaceId is required" });
    return;
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace || !isWorkspaceMember(workspace, socket.data.user.id)) {
    callback?.({ success: false, message: "Workspace access denied" });
    return;
  }

  await socket.join(socketRooms.getWorkspaceRoom(workspaceId));
  callback?.({ success: true, room: socketRooms.getWorkspaceRoom(workspaceId) });
};

const joinBoard = async (
  socket: any,
  payload: unknown,
  callback?: (response: unknown) => void,
) => {
  const boardId = getIdFromPayload(payload, "boardId");

  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    callback?.({ success: false, message: "Valid boardId is required" });
    return;
  }

  const board = await Board.findById(boardId);

  if (!board) {
    callback?.({ success: false, message: "Board access denied" });
    return;
  }

  const workspace = await Workspace.findById(board.workspace);

  if (!workspace || !isWorkspaceMember(workspace, socket.data.user.id)) {
    callback?.({ success: false, message: "Board access denied" });
    return;
  }

  await socket.join(socketRooms.getBoardRoom(boardId));
  callback?.({ success: true, room: socketRooms.getBoardRoom(boardId) });
};

const initializeSocket = (server: HttpServer) => {
  const io = new socketIo.Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || true,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = getTokenFromHandshake(socket);

    if (!token) {
      next(new Error("Access token is required"));
      return;
    }

    try {
      const payload = authService.verifyAccessToken(token);
      socket.data.user = {
        id: payload.userId,
      };
      next();
    } catch {
      next(new Error("Invalid or expired access token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinWorkspace", (workspaceId, callback) => {
      joinWorkspace(socket, workspaceId, callback).catch(() => {
        callback?.({ success: false, message: "Could not join workspace" });
      });
    });

    socket.on("joinBoard", (boardId, callback) => {
      joinBoard(socket, boardId, callback).catch(() => {
        callback?.({ success: false, message: "Could not join board" });
      });
    });
  });

  socketEmitter.setSocketServer(io);

  return io;
};

export = {
  initializeSocket,
};
