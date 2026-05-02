import mongoose = require("mongoose");

const activityActions = [
  "created",
  "updated",
  "deleted",
  "moved",
  "commented",
  "assigned",
  "completed",
] as const;
type ActivityAction = (typeof activityActions)[number];

const activityEntityTypes = ["workspace", "board", "task", "comment"] as const;
type ActivityEntityType = (typeof activityEntityTypes)[number];

interface IActivityLog {
  workspace: mongoose.Types.ObjectId;
  board?: mongoose.Types.ObjectId;
  task?: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: mongoose.Types.ObjectId;
  message: string;
  metadata?: Record<string, unknown>;
}

const activityLogSchema = new mongoose.Schema<IActivityLog>(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: activityActions,
      required: true,
    },
    entityType: {
      type: String,
      enum: activityEntityTypes,
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activityLogSchema.index({ workspace: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

const ActivityLog =
  (mongoose.models.ActivityLog as mongoose.Model<IActivityLog> | undefined) ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export = ActivityLog;
