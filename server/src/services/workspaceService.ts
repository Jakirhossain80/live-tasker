import mongoose = require("mongoose");
import User = require("../models/User");
import Workspace = require("../models/Workspace");

const workspaceMemberRoles = ["owner", "admin", "member"] as const;
type WorkspaceMemberRole = (typeof workspaceMemberRoles)[number];
type ManageableWorkspaceMemberRole = Exclude<WorkspaceMemberRole, "owner">;

interface CreateWorkspaceInput {
  name: string;
  description?: string;
  ownerId: string;
}

interface UpdateWorkspaceInput {
  workspaceId: string;
  userId: string;
  name?: string;
  description?: string;
  isArchived?: boolean;
}

interface AddMemberInput {
  workspaceId: string;
  actorId: string;
  userId: string;
  role: ManageableWorkspaceMemberRole;
}

interface UpdateMemberInput {
  workspaceId: string;
  actorId: string;
  userId: string;
  role: ManageableWorkspaceMemberRole;
}

interface RemoveMemberInput {
  workspaceId: string;
  actorId: string;
  userId: string;
}

const createHttpError = (message: string, statusCode: number) => {
  const error = new Error(message);
  Object.assign(error, { statusCode });
  return error;
};

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (id: string, fieldName: string) => {
  if (!isValidObjectId(id)) {
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

const populateWorkspace = (query: any) => {
  return query
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");
};

const createWorkspace = async ({
  name,
  description,
  ownerId,
}: CreateWorkspaceInput) => {
  validateObjectId(ownerId, "owner id");

  const owner = await User.findById(ownerId);

  if (!owner || !owner.isActive) {
    throw createHttpError("User not found", 404);
  }

  const workspaceData: any = {
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

  const workspace = await (Workspace as any).create(workspaceData);

  return populateWorkspace(Workspace.findById(workspace._id));
};

const getWorkspaces = async (userId: string) => {
  validateObjectId(userId, "user id");

  return populateWorkspace(
    Workspace.find({
      "members.user": userId,
    }).sort({ updatedAt: -1 }),
  );
};

const getWorkspaceById = async (workspaceId: string, userId: string) => {
  await getWorkspaceForMember(workspaceId, userId);

  return populateWorkspace(Workspace.findById(workspaceId));
};

const updateWorkspace = async ({
  workspaceId,
  userId,
  name,
  description,
  isArchived,
}: UpdateWorkspaceInput) => {
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

const addMember = async ({
  workspaceId,
  actorId,
  userId,
  role,
}: AddMemberInput) => {
  validateObjectId(userId, "user id");

  const workspace = await getWorkspaceForAdmin(workspaceId, actorId);
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw createHttpError("User not found", 404);
  }

  if (getMember(workspace, userId)) {
    throw createHttpError("User is already a workspace member", 409);
  }

  workspace.members.push({
    user: new mongoose.Types.ObjectId(userId),
    role,
    joinedAt: new Date(),
  });

  await workspace.save();

  return populateWorkspace(Workspace.findById(workspace._id));
};

const updateMember = async ({
  workspaceId,
  actorId,
  userId,
  role,
}: UpdateMemberInput) => {
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

const removeMember = async ({
  workspaceId,
  actorId,
  userId,
}: RemoveMemberInput) => {
  validateObjectId(userId, "user id");

  const workspace = await getWorkspaceForAdmin(workspaceId, actorId);
  const member = getMember(workspace, userId);

  if (!member) {
    throw createHttpError("Workspace member not found", 404);
  }

  if (member.role === "owner") {
    throw createHttpError("Workspace owner cannot be removed", 400);
  }

  workspace.members = workspace.members.filter(
    (workspaceMember: any) => String(workspaceMember.user) !== userId,
  );

  await workspace.save();
};

export = {
  workspaceMemberRoles,
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addMember,
  updateMember,
  removeMember,
};
