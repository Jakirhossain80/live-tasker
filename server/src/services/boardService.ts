import mongoose = require("mongoose");
import Board = require("../models/Board");
import Workspace = require("../models/Workspace");

interface BoardColumnInput {
  title: string;
  order: number;
}

interface CreateBoardInput {
  workspaceId: string;
  userId: string;
  name: string;
  description?: string;
  columns?: BoardColumnInput[];
}

interface UpdateBoardInput {
  boardId: string;
  userId: string;
  name?: string;
  description?: string;
  columns?: BoardColumnInput[];
  isArchived?: boolean;
}

const createHttpError = (message: string, statusCode: number) => {
  const error = new Error(message);
  Object.assign(error, { statusCode });
  return error;
};

const validateObjectId = (id: string, fieldName: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(`Invalid ${fieldName}`, 400);
  }
};

const getMember = (workspace: any, userId: string) => {
  return workspace.members.find((member: any) => String(member.user) === userId);
};

const ensureWorkspaceMember = (workspace: any, userId: string) => {
  const member = getMember(workspace, userId);

  if (!member) {
    throw createHttpError("Workspace not found", 404);
  }

  return member;
};

const ensureWorkspaceAdmin = (workspace: any, userId: string) => {
  const member = ensureWorkspaceMember(workspace, userId);

  if (member.role !== "owner" && member.role !== "admin") {
    throw createHttpError("Only workspace owners and admins can do this", 403);
  }

  return member;
};

const getWorkspaceForMember = async (workspaceId: string, userId: string) => {
  validateObjectId(workspaceId, "workspace id");

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw createHttpError("Workspace not found", 404);
  }

  ensureWorkspaceMember(workspace, userId);

  return workspace;
};

const getWorkspaceForAdmin = async (workspaceId: string, userId: string) => {
  const workspace = await getWorkspaceForMember(workspaceId, userId);
  ensureWorkspaceAdmin(workspace, userId);

  return workspace;
};

const populateBoard = (query: any) => {
  return query
    .populate("workspace", "name description owner isArchived")
    .populate("createdBy", "name email avatar");
};

const getBoardForMember = async (boardId: string, userId: string) => {
  validateObjectId(boardId, "board id");

  const board = await Board.findById(boardId);

  if (!board) {
    throw createHttpError("Board not found", 404);
  }

  await getWorkspaceForMember(String(board.workspace), userId);

  return board;
};

const getBoardForAdmin = async (boardId: string, userId: string) => {
  const board = await getBoardForMember(boardId, userId);
  await getWorkspaceForAdmin(String(board.workspace), userId);

  return board;
};

const normalizeColumns = (columns: BoardColumnInput[]) => {
  return columns.map((column) => ({
    title: column.title.trim(),
    order: column.order,
  }));
};

const createBoard = async ({
  workspaceId,
  userId,
  name,
  description,
  columns,
}: CreateBoardInput) => {
  const workspace = await getWorkspaceForAdmin(workspaceId, userId);

  const boardData: any = {
    workspace: workspace._id,
    name: name.trim(),
    createdBy: userId,
  };

  if (description !== undefined) {
    boardData.description = description.trim();
  }

  if (columns !== undefined) {
    boardData.columns = normalizeColumns(columns);
  }

  const board = await (Board as any).create(boardData);

  return populateBoard(Board.findById(board._id));
};

const getBoardsByWorkspace = async (workspaceId: string, userId: string) => {
  await getWorkspaceForMember(workspaceId, userId);

  return populateBoard(
    Board.find({
      workspace: workspaceId,
    }).sort({ updatedAt: -1 }),
  );
};

const getBoardById = async (boardId: string, userId: string) => {
  await getBoardForMember(boardId, userId);

  return populateBoard(Board.findById(boardId));
};

const updateBoard = async ({
  boardId,
  userId,
  name,
  description,
  columns,
  isArchived,
}: UpdateBoardInput) => {
  const board = await getBoardForAdmin(boardId, userId);

  if (name !== undefined) {
    board.name = name.trim();
  }

  if (description !== undefined) {
    board.description = description.trim();
  }

  if (columns !== undefined) {
    board.columns = normalizeColumns(columns) as any;
  }

  if (isArchived !== undefined) {
    board.isArchived = isArchived;
  }

  await board.save();

  return populateBoard(Board.findById(board._id));
};

const deleteBoard = async (boardId: string, userId: string) => {
  const board = await getBoardForAdmin(boardId, userId);
  await Board.findByIdAndDelete(board._id);
};

export = {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
};
