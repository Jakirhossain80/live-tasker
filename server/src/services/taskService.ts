import mongoose = require("mongoose");
import Board = require("../models/Board");
import Task = require("../models/Task");
import Workspace = require("../models/Workspace");
import activityLogService = require("./activityLogService");

const taskPriorities = ["low", "medium", "high", "urgent"] as const;
type TaskPriority = (typeof taskPriorities)[number];

interface CreateTaskInput {
  boardId: string;
  userId: string;
  status: string;
  title: string;
  description?: string;
  assignees?: string[];
  priority?: TaskPriority;
  dueDate?: string | null;
  labels?: string[];
  order?: number;
}

interface UpdateTaskInput {
  taskId: string;
  userId: string;
  status?: string;
  title?: string;
  description?: string;
  assignees?: string[];
  priority?: TaskPriority;
  dueDate?: string | null;
  labels?: string[];
  order?: number;
}

interface MoveTaskInput {
  taskId: string;
  userId: string;
  status: string;
  order: number;
}

const createHttpError = (
  message: string,
  statusCode: number,
  errorCode: string,
) => {
  const error = new Error(message);
  Object.assign(error, { statusCode, errorCode });
  return error;
};

const validateObjectId = (
  id: string,
  fieldName: string,
  errorCode = "INVALID_OBJECT_ID",
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(`Invalid ${fieldName}`, 400, errorCode);
  }
};

const getMember = (workspace: any, userId: string) => {
  return workspace.members.find((member: any) => String(member.user) === userId);
};

const ensureWorkspaceMember = (workspace: any, userId: string) => {
  const member = getMember(workspace, userId);

  if (!member) {
    // The workspace exists, but this user is not listed in its members array.
    throw createHttpError(
      "User is not a member of this workspace",
      403,
      "WORKSPACE_MEMBERSHIP_REQUIRED",
    );
  }

  return member;
};

const getWorkspaceForMember = async (workspaceId: string, userId: string) => {
  validateObjectId(workspaceId, "workspace id");

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw createHttpError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  ensureWorkspaceMember(workspace, userId);

  return workspace;
};

const populateTask = (query: any) => {
  return query
    .populate("workspace", "name description owner isArchived")
    .populate("board", "name description columns isArchived")
    .populate("assignees", "name email avatar")
    .populate("createdBy", "name email avatar");
};

const ensureBoardStatus = (board: any, statusId: string) => {
  // status comes from the request as columnId, so name it that way for new API users.
  if (!mongoose.Types.ObjectId.isValid(statusId)) {
    throw createHttpError(
      "Invalid columnId. Please provide a valid board column _id.",
      400,
      "INVALID_COLUMN_ID",
    );
  }

  const statusExists = board.columns.some(
    (column: any) => String(column._id) === statusId,
  );

  if (!statusExists) {
    throw createHttpError(
      "Invalid columnId. Please provide a valid board column _id.",
      400,
      "INVALID_COLUMN_ID",
    );
  }
};

const getBoardForMember = async (boardId: string, userId: string) => {
  // Treat a malformed boardId the same as a missing board to avoid confusing beginners.
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw createHttpError("Board not found", 404, "BOARD_NOT_FOUND");
  }

  const board = await Board.findById(boardId);

  if (!board) {
    throw createHttpError("Board not found", 404, "BOARD_NOT_FOUND");
  }

  await getWorkspaceForMember(String(board.workspace), userId);

  return board;
};

const getTaskForMember = async (taskId: string, userId: string) => {
  validateObjectId(taskId, "task id");

  const task = await Task.findById(taskId);

  if (!task) {
    throw createHttpError("Task not found", 404, "TASK_NOT_FOUND");
  }

  await getWorkspaceForMember(String(task.workspace), userId);

  return task;
};

const ensureWorkspaceAssignees = async (workspaceId: string, assignees: string[]) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw createHttpError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  for (const assignee of assignees) {
    validateObjectId(assignee, "assignee id", "INVALID_ASSIGNEE_ID");

    if (!getMember(workspace, assignee)) {
      // Tasks can only be assigned to users who already belong to the board workspace.
      throw createHttpError(
        "Assignee is not a member of this workspace",
        400,
        "ASSIGNEE_NOT_WORKSPACE_MEMBER",
      );
    }
  }
};

const normalizeLabels = (labels: string[]) => {
  return labels.map((label) => label.trim()).filter(Boolean);
};

const getDefinedFields = (fields: Record<string, unknown>) => {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([field]) => field);
};

const createTask = async ({
  boardId,
  userId,
  status,
  title,
  description,
  assignees,
  priority,
  dueDate,
  labels,
  order,
}: CreateTaskInput) => {
  const board = await getBoardForMember(boardId, userId);
  ensureBoardStatus(board, status);

  if (assignees !== undefined) {
    await ensureWorkspaceAssignees(String(board.workspace), assignees);
  }

  const taskData: any = {
    workspace: board.workspace,
    board: board._id,
    status,
    title: title.trim(),
    createdBy: userId,
  };

  if (description !== undefined) {
    taskData.description = description.trim();
  }

  if (assignees !== undefined) {
    taskData.assignees = assignees;
  }

  if (priority !== undefined) {
    taskData.priority = priority;
  }

  if (dueDate !== undefined && dueDate !== null) {
    taskData.dueDate = new Date(dueDate);
  }

  if (labels !== undefined) {
    taskData.labels = normalizeLabels(labels);
  }

  if (order !== undefined) {
    taskData.order = order;
  }

  const task = await (Task as any).create(taskData);

  await activityLogService.logTaskCreated({
    workspace: task.workspace,
    board: task.board,
    task: task._id,
    actor: userId,
    taskTitle: task.title,
    metadata: {
      status,
      priority: task.priority,
    },
  });

  return populateTask(Task.findById(task._id));
};

const getTasksByBoard = async (boardId: string, userId: string) => {
  await getBoardForMember(boardId, userId);

  return populateTask(
    Task.find({
      board: boardId,
    }).sort({ status: 1, order: 1, createdAt: 1 }),
  );
};

const getTaskById = async (taskId: string, userId: string) => {
  await getTaskForMember(taskId, userId);

  return populateTask(Task.findById(taskId));
};

const updateTask = async ({
  taskId,
  userId,
  status,
  title,
  description,
  assignees,
  priority,
  dueDate,
  labels,
  order,
}: UpdateTaskInput) => {
  const task = await getTaskForMember(taskId, userId);
  const updatedFields = getDefinedFields({
    status,
    title,
    description,
    assignees,
    priority,
    dueDate,
    labels,
    order,
  });
  const previousStatus = String(task.status);
  const previousOrder = task.order;

  if (status !== undefined) {
    const board = await Board.findById(task.board);

    if (!board) {
      throw createHttpError("Board not found", 404, "BOARD_NOT_FOUND");
    }

    ensureBoardStatus(board, status);
    task.status = new mongoose.Types.ObjectId(status) as any;
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (assignees !== undefined) {
    await ensureWorkspaceAssignees(String(task.workspace), assignees);
    task.assignees = assignees.map(
      (assignee) => new mongoose.Types.ObjectId(assignee),
    ) as any;
  }

  if (priority !== undefined) {
    task.priority = priority;
  }

  if (dueDate !== undefined) {
    task.set("dueDate", dueDate === null ? undefined : new Date(dueDate));
  }

  if (labels !== undefined) {
    task.labels = normalizeLabels(labels);
  }

  if (order !== undefined) {
    task.order = order;
  }

  await task.save();

  await activityLogService.logTaskUpdated({
    workspace: task.workspace,
    board: task.board,
    task: task._id,
    actor: userId,
    taskTitle: task.title,
    metadata: {
      updatedFields,
      previousStatus,
      currentStatus: String(task.status),
      previousOrder,
      currentOrder: task.order,
    },
  });

  return populateTask(Task.findById(task._id));
};

const moveTask = async ({ taskId, userId, status, order }: MoveTaskInput) => {
  const task = await getTaskForMember(taskId, userId);
  const previousStatus = String(task.status);
  const previousOrder = task.order;
  const board = await Board.findById(task.board);

  if (!board) {
    throw createHttpError("Board not found", 404, "BOARD_NOT_FOUND");
  }

  ensureBoardStatus(board, status);

  task.status = new mongoose.Types.ObjectId(status) as any;
  task.order = order;

  await task.save();

  await activityLogService.logTaskMoved({
    workspace: task.workspace,
    board: task.board,
    task: task._id,
    actor: userId,
    taskTitle: task.title,
    metadata: {
      previousStatus,
      currentStatus: String(task.status),
      previousOrder,
      currentOrder: task.order,
    },
  });

  return populateTask(Task.findById(task._id));
};

const deleteTask = async (taskId: string, userId: string) => {
  const task = await getTaskForMember(taskId, userId);

  const workspace = await Workspace.findById(task.workspace);

  if (!workspace) {
    throw createHttpError("Workspace not found", 404, "WORKSPACE_NOT_FOUND");
  }

  const member = ensureWorkspaceMember(workspace, userId);
  const canDelete =
    member.role === "owner" ||
    member.role === "admin" ||
    String(task.createdBy) === userId;

  if (!canDelete) {
    throw createHttpError(
      "Only workspace owners, admins, or task creators can delete tasks",
      403,
      "TASK_DELETE_FORBIDDEN",
    );
  }

  await Task.findByIdAndDelete(task._id);
};

export = {
  taskPriorities,
  createTask,
  getTasksByBoard,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
};
