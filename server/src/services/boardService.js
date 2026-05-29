"use strict";
const mongoose = require("mongoose");
const Board = require("../models/Board");
const Workspace = require("../models/Workspace");
const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    Object.assign(error, { statusCode });
    return error;
};
const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(`Invalid ${fieldName}`, 400);
    }
};
const getMember = (workspace, userId) => {
    return workspace.members.find((member) => String(member.user) === userId);
};
const ensureWorkspaceMember = (workspace, userId) => {
    const member = getMember(workspace, userId);
    if (!member) {
        throw createHttpError("Workspace not found", 404);
    }
    return member;
};
const ensureWorkspaceAdmin = (workspace, userId) => {
    const member = ensureWorkspaceMember(workspace, userId);
    if (member.role !== "owner" && member.role !== "admin") {
        throw createHttpError("Only workspace owners and admins can do this", 403);
    }
    return member;
};
const getWorkspaceForMember = async (workspaceId, userId) => {
    validateObjectId(workspaceId, "workspace id");
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw createHttpError("Workspace not found", 404);
    }
    ensureWorkspaceMember(workspace, userId);
    return workspace;
};
const getWorkspaceForAdmin = async (workspaceId, userId) => {
    const workspace = await getWorkspaceForMember(workspaceId, userId);
    ensureWorkspaceAdmin(workspace, userId);
    return workspace;
};
const populateBoard = (query) => {
    return query
        .populate("workspace", "name description owner isArchived")
        .populate("createdBy", "name email avatar");
};
const getBoardForMember = async (boardId, userId) => {
    validateObjectId(boardId, "board id");
    const board = await Board.findById(boardId);
    if (!board) {
        throw createHttpError("Board not found", 404);
    }
    await getWorkspaceForMember(String(board.workspace), userId);
    return board;
};
const getBoardForAdmin = async (boardId, userId) => {
    const board = await getBoardForMember(boardId, userId);
    await getWorkspaceForAdmin(String(board.workspace), userId);
    return board;
};
const normalizeColumns = (columns) => {
    return columns.map((column) => {
        const normalizedColumn = {
            title: column.title.trim(),
            order: column.order,
        };
        if (column._id !== undefined) {
            normalizedColumn._id = column._id;
        }
        return normalizedColumn;
    });
};
const createBoard = async ({ workspaceId, userId, name, description, columns, }) => {
    const workspace = await getWorkspaceForAdmin(workspaceId, userId);
    const boardData = {
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
    const board = await Board.create(boardData);
    return populateBoard(Board.findById(board._id));
};
const getBoardsByWorkspace = async (workspaceId, userId) => {
    await getWorkspaceForMember(workspaceId, userId);
    return populateBoard(Board.find({
        workspace: workspaceId,
        isArchived: false,
    }).sort({ updatedAt: -1 }));
};
const getBoardById = async (boardId, userId) => {
    await getBoardForMember(boardId, userId);
    return populateBoard(Board.findById(boardId));
};
const updateBoard = async ({ boardId, userId, name, description, columns, isArchived, }) => {
    const board = await getBoardForAdmin(boardId, userId);
    if (name !== undefined) {
        board.name = name.trim();
    }
    if (description !== undefined) {
        board.description = description.trim();
    }
    if (columns !== undefined) {
        board.columns = normalizeColumns(columns);
    }
    if (isArchived !== undefined) {
        board.isArchived = isArchived;
    }
    await board.save();
    return populateBoard(Board.findById(board._id));
};
const deleteBoard = async (boardId, userId) => {
    const board = await getBoardForAdmin(boardId, userId);
    await Board.findByIdAndDelete(board._id);
};
module.exports = {
    createBoard,
    getBoardsByWorkspace,
    getBoardById,
    updateBoard,
    deleteBoard,
};
//# sourceMappingURL=boardService.js.map