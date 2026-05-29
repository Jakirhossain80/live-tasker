import mongoose = require("mongoose");
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
declare const _default: {
    logActivity: ({ workspace, board, task, actor, action, entityType, entityId, message, metadata, }: LogActivityInput) => Promise<unknown>;
    logTaskCreated: ({ workspace, board, task, actor, taskTitle, metadata, }: LogTaskInput) => Promise<unknown>;
    logTaskUpdated: ({ workspace, board, task, actor, taskTitle, metadata, }: LogTaskInput) => Promise<unknown>;
    logTaskMoved: ({ workspace, board, task, actor, taskTitle, metadata, }: LogTaskInput) => Promise<unknown>;
    logCommentAdded: ({ workspace, board, task, comment, actor, taskTitle, metadata, }: LogCommentAddedInput) => Promise<unknown>;
    getWorkspaceActivity: (workspaceId: string, limit?: number) => Promise<unknown[]>;
};
export = _default;
//# sourceMappingURL=activityLogService.d.ts.map