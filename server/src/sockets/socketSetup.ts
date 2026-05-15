import type { Server as HttpServer } from "http";
import mongoose = require("mongoose");
import socketIo = require("socket.io");
import authService = require("../services/authService");
import Board = require("../models/Board");
import User = require("../models/User");
import Workspace = require("../models/Workspace");
import socketEmitter = require("./socketEmitter");
import socketRooms = require("./socketRooms");

type OnlineUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const workspacePresence = new Map<string, Map<string, Set<string>>>();

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

const getOnlineUsers = async (workspaceId: string) => {
  const workspaceUsers = workspacePresence.get(workspaceId);
  const userIds = workspaceUsers ? Array.from(workspaceUsers.keys()) : [];

  if (userIds.length === 0) {
    return [];
  }

  const users = await User.find({ _id: { $in: userIds } }).select(
    "name email avatar",
  );
  const userById = new Map(users.map((user: any) => [String(user._id), user]));

  return userIds
    .map((userId) => {
      const user = userById.get(userId);

      if (!user) {
        return null;
      }

      return {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };
    })
    .filter(Boolean) as OnlineUser[];
};

const emitPresenceUpdated = async (io: socketIo.Server, workspaceId: string) => {
  const users = await getOnlineUsers(workspaceId);
  const payload = { workspaceId, users };

  io.to(socketRooms.getWorkspaceRoom(workspaceId)).emit("onlineUsers", payload);
  io.to(socketRooms.getWorkspaceRoom(workspaceId)).emit(
    "presenceUpdated",
    payload,
  );
};

const trackWorkspacePresence = async (
  io: socketIo.Server,
  socket: any,
  workspaceId: string,
) => {
  let workspaceUsers = workspacePresence.get(workspaceId);

  if (!workspaceUsers) {
    workspaceUsers = new Map<string, Set<string>>();
    workspacePresence.set(workspaceId, workspaceUsers);
  }

  const userId = socket.data.user.id;
  let userSockets = workspaceUsers.get(userId);
  const wasOffline = !userSockets || userSockets.size === 0;

  if (!userSockets) {
    userSockets = new Set<string>();
    workspaceUsers.set(userId, userSockets);
  }

  userSockets.add(socket.id);
  socket.data.workspaceIds ??= new Set<string>();
  socket.data.workspaceIds.add(workspaceId);

  if (wasOffline) {
    const users = await getOnlineUsers(workspaceId);
    const user = users.find((onlineUser) => onlineUser.id === userId);

    if (user) {
      io.to(socketRooms.getWorkspaceRoom(workspaceId)).emit("userOnline", {
        workspaceId,
        user,
      });
    }
  }

  await emitPresenceUpdated(io, workspaceId);
};

const untrackWorkspacePresence = async (
  io: socketIo.Server,
  socket: any,
  workspaceId: string,
) => {
  const workspaceUsers = workspacePresence.get(workspaceId);

  if (!workspaceUsers) {
    return;
  }

  const userId = socket.data.user.id;
  const userSockets = workspaceUsers.get(userId);

  userSockets?.delete(socket.id);

  if (userSockets && userSockets.size > 0) {
    await emitPresenceUpdated(io, workspaceId);
    return;
  }

  workspaceUsers.delete(userId);

  if (workspaceUsers.size === 0) {
    workspacePresence.delete(workspaceId);
  }

  io.to(socketRooms.getWorkspaceRoom(workspaceId)).emit("userOffline", {
    workspaceId,
    userId,
  });
  await emitPresenceUpdated(io, workspaceId);
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
  io: socketIo.Server,
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
  await trackWorkspacePresence(io, socket, workspaceId);
  callback?.({ success: true, room: socketRooms.getWorkspaceRoom(workspaceId) });
};

const joinBoard = async (
  io: socketIo.Server,
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
  await socket.join(socketRooms.getWorkspaceRoom(String(board.workspace)));
  await trackWorkspacePresence(io, socket, String(board.workspace));
  callback?.({ success: true, room: socketRooms.getBoardRoom(boardId) });
};

const leaveWorkspace = async (
  io: socketIo.Server,
  socket: any,
  payload: unknown,
  callback?: (response: unknown) => void,
) => {
  const workspaceId = getIdFromPayload(payload, "workspaceId");

  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    callback?.({ success: false, message: "Valid workspaceId is required" });
    return;
  }

  await untrackWorkspacePresence(io, socket, workspaceId);
  await socket.leave(socketRooms.getWorkspaceRoom(workspaceId));
  socket.data.workspaceIds?.delete(workspaceId);
  callback?.({ success: true, room: socketRooms.getWorkspaceRoom(workspaceId) });
};

const leaveBoard = async (
  io: socketIo.Server,
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

  if (board) {
    const workspaceId = String(board.workspace);

    await untrackWorkspacePresence(io, socket, workspaceId);
    await socket.leave(socketRooms.getWorkspaceRoom(workspaceId));
    socket.data.workspaceIds?.delete(workspaceId);
  }

  await socket.leave(socketRooms.getBoardRoom(boardId));
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
      joinWorkspace(io, socket, workspaceId, callback).catch(() => {
        callback?.({ success: false, message: "Could not join workspace" });
      });
    });

    socket.on("joinBoard", (boardId, callback) => {
      joinBoard(io, socket, boardId, callback).catch(() => {
        callback?.({ success: false, message: "Could not join board" });
      });
    });

    socket.on("leaveWorkspace", (workspaceId, callback) => {
      leaveWorkspace(io, socket, workspaceId, callback).catch(() => {
        callback?.({ success: false, message: "Could not leave workspace" });
      });
    });

    socket.on("leaveBoard", (boardId, callback) => {
      leaveBoard(io, socket, boardId, callback).catch(() => {
        callback?.({ success: false, message: "Could not leave board" });
      });
    });

    socket.on("disconnect", () => {
      const workspaceIds = Array.from(socket.data.workspaceIds ?? []) as string[];

      workspaceIds.forEach((workspaceId) => {
        untrackWorkspacePresence(io, socket, workspaceId).catch(() => undefined);
      });
    });
  });

  socketEmitter.setSocketServer(io);

  return io;
};

export = {
  initializeSocket,
};
