import mongoose = require("mongoose");
import ActivityLog = require("../models/ActivityLog");

type ActivityAction = "created" | "updated" | "moved" | "commented";
type ActivityEntityType = "task" | "comment";
type ActivityRef = string | mongoose.Types.ObjectId;

interface LogActivityInput {
  workspace: ActivityRef;
  board?: ActivityRef;
  task?: ActivityRef;
  actor: ActivityRef;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: ActivityRef;
  message: string;
  metadata?: Record<string, unknown> | undefined;
}

interface LogTaskInput {
  workspace: ActivityRef;
  board: ActivityRef;
  task: ActivityRef;
  actor: ActivityRef;
  taskTitle: string;
  metadata?: Record<string, unknown> | undefined;
}

interface LogCommentAddedInput {
  workspace: ActivityRef;
  board: ActivityRef;
  task: ActivityRef;
  comment: ActivityRef;
  actor: ActivityRef;
  taskTitle: string;
  metadata?: Record<string, unknown> | undefined;
}

const logActivity = async ({
  workspace,
  board,
  task,
  actor,
  action,
  entityType,
  entityId,
  message,
  metadata,
}: LogActivityInput): Promise<unknown> => {
  const activityData: any = {
    workspace,
    actor,
    action,
    entityType,
    entityId,
    message,
  };

  if (board !== undefined) {
    activityData.board = board;
  }

  if (task !== undefined) {
    activityData.task = task;
  }

  if (metadata !== undefined) {
    activityData.metadata = metadata;
  }

  return ActivityLog.create(activityData);
};

const logTaskCreated = async ({
  workspace,
  board,
  task,
  actor,
  taskTitle,
  metadata,
}: LogTaskInput): Promise<unknown> => {
  return logActivity({
    workspace,
    board,
    task,
    actor,
    action: "created",
    entityType: "task",
    entityId: task,
    message: `Task "${taskTitle}" was created`,
    metadata,
  });
};

const logTaskUpdated = async ({
  workspace,
  board,
  task,
  actor,
  taskTitle,
  metadata,
}: LogTaskInput): Promise<unknown> => {
  return logActivity({
    workspace,
    board,
    task,
    actor,
    action: "updated",
    entityType: "task",
    entityId: task,
    message: `Task "${taskTitle}" was updated`,
    metadata,
  });
};

const logTaskMoved = async ({
  workspace,
  board,
  task,
  actor,
  taskTitle,
  metadata,
}: LogTaskInput): Promise<unknown> => {
  return logActivity({
    workspace,
    board,
    task,
    actor,
    action: "moved",
    entityType: "task",
    entityId: task,
    message: `Task "${taskTitle}" was moved`,
    metadata,
  });
};

const logCommentAdded = async ({
  workspace,
  board,
  task,
  comment,
  actor,
  taskTitle,
  metadata,
}: LogCommentAddedInput): Promise<unknown> => {
  return logActivity({
    workspace,
    board,
    task,
    actor,
    action: "commented",
    entityType: "comment",
    entityId: comment,
    message: `Comment added to task "${taskTitle}"`,
    metadata,
  });
};

export = {
  logActivity,
  logTaskCreated,
  logTaskUpdated,
  logTaskMoved,
  logCommentAdded,
};
