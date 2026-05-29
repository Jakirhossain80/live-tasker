"use strict";
const mongoose = require("mongoose");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const workspaceMemberRoles = ["owner", "admin", "member"];
const createHttpError = (message, statusCode) => {
    const error = new Error(message);
    Object.assign(error, { statusCode });
    return error;
};
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validateObjectId = (id, fieldName) => {
    if (!isValidObjectId(id)) {
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
const ensureWorkspaceOwner = (workspace, userId) => {
    const member = ensureWorkspaceMember(workspace, userId);
    if (member.role !== "owner") {
        throw createHttpError("Only workspace owners can do this", 403);
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
const populateWorkspace = (query) => {
    return query
        .populate("owner", "name email avatar")
        .populate("members.user", "name email avatar");
};
const createWorkspace = async ({ name, description, ownerId, }) => {
    validateObjectId(ownerId, "owner id");
    const owner = await User.findById(ownerId);
    if (!owner || !owner.isActive) {
        throw createHttpError("User not found", 404);
    }
    const workspaceData = {
        name: name.trim(),
        owner: ownerId,
        members: [
            {
                user: ownerId,
                role: "owner",
            },
        ],
    };
    if (description !== undefined) {
        workspaceData.description = description.trim();
    }
    const workspace = await Workspace.create(workspaceData);
    return populateWorkspace(Workspace.findById(workspace._id));
};
const getWorkspaces = async (userId) => {
    validateObjectId(userId, "user id");
    return populateWorkspace(Workspace.find({
        "members.user": userId,
    }).sort({ updatedAt: -1 }));
};
const getWorkspaceById = async (workspaceId, userId) => {
    await getWorkspaceForMember(workspaceId, userId);
    return populateWorkspace(Workspace.findById(workspaceId));
};
const updateWorkspace = async ({ workspaceId, userId, name, description, isArchived, }) => {
    const workspace = await getWorkspaceForAdmin(workspaceId, userId);
    if (name !== undefined) {
        workspace.name = name.trim();
    }
    if (description !== undefined) {
        workspace.description = description.trim();
    }
    if (isArchived !== undefined) {
        workspace.isArchived = isArchived;
    }
    await workspace.save();
    return populateWorkspace(Workspace.findById(workspace._id));
};
const archiveWorkspace = async ({ workspaceId, userId }) => {
    const workspace = await getWorkspaceForMember(workspaceId, userId);
    ensureWorkspaceOwner(workspace, userId);
    workspace.isArchived = true;
    await workspace.save();
    return populateWorkspace(Workspace.findById(workspace._id));
};
const addMember = async ({ workspaceId, actorId, userId, email, role, }) => {
    const workspace = await getWorkspaceForAdmin(workspaceId, actorId);
    const normalizedEmail = email?.trim().toLowerCase();
    let user;
    if (userId) {
        validateObjectId(userId, "user id");
        user = await User.findById(userId);
    }
    else if (normalizedEmail) {
        user = await User.findOne({ email: normalizedEmail });
    }
    else {
        throw createHttpError("User id or email is required", 400);
    }
    if (!user || !user.isActive) {
        throw createHttpError(normalizedEmail ? "User with this email was not found" : "User not found", 404);
    }
    const memberUserId = String(user._id);
    if (getMember(workspace, memberUserId)) {
        throw createHttpError("User is already a workspace member", 409);
    }
    workspace.members.push({
        user: user._id,
        role,
        joinedAt: new Date(),
    });
    await workspace.save();
    return populateWorkspace(Workspace.findById(workspace._id));
};
const joinWorkspace = async ({ workspaceId, userId }) => {
    validateObjectId(workspaceId, "workspace id");
    validateObjectId(userId, "user id");
    const [workspace, user] = await Promise.all([
        Workspace.findById(workspaceId),
        User.findById(userId),
    ]);
    if (!workspace) {
        throw createHttpError("Workspace not found", 404);
    }
    if (!user || !user.isActive) {
        throw createHttpError("User not found", 404);
    }
    if (!getMember(workspace, userId)) {
        workspace.members.push({
            user: user._id,
            role: "member",
            joinedAt: new Date(),
        });
        await workspace.save();
    }
    return populateWorkspace(Workspace.findById(workspace._id));
};
const updateMember = async ({ workspaceId, actorId, userId, role, }) => {
    validateObjectId(userId, "user id");
    const workspace = await getWorkspaceForAdmin(workspaceId, actorId);
    const member = getMember(workspace, userId);
    if (!member) {
        throw createHttpError("Workspace member not found", 404);
    }
    if (member.role === "owner") {
        throw createHttpError("Workspace owner role cannot be changed", 400);
    }
    member.role = role;
    await workspace.save();
    return populateWorkspace(Workspace.findById(workspace._id));
};
const removeMember = async ({ workspaceId, actorId, userId, }) => {
    validateObjectId(userId, "user id");
    const workspace = await getWorkspaceForAdmin(workspaceId, actorId);
    const member = getMember(workspace, userId);
    if (!member) {
        throw createHttpError("Workspace member not found", 404);
    }
    if (member.role === "owner") {
        throw createHttpError("Workspace owner cannot be removed", 400);
    }
    workspace.members = workspace.members.filter((workspaceMember) => String(workspaceMember.user) !== userId);
    await workspace.save();
};
module.exports = {
    workspaceMemberRoles,
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    archiveWorkspace,
    addMember,
    joinWorkspace,
    updateMember,
    removeMember,
};
//# sourceMappingURL=workspaceService.js.map