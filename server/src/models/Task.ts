import mongoose = require("mongoose");

const taskPriorities = ["low", "medium", "high", "urgent"] as const;
type TaskPriority = (typeof taskPriorities)[number];

interface ITask {
  workspace: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  status: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignees: mongoose.Types.ObjectId[];
  priority: TaskPriority;
  dueDate?: Date;
  labels: string[];
  order: number;
  createdBy: mongoose.Types.ObjectId;
  isArchived: boolean;
}

const taskSchema = new mongoose.Schema<ITask>(
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
      required: true,
      index: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    assignees: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    priority: {
      type: String,
      enum: taskPriorities,
      default: "medium",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    labels: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ board: 1, status: 1, order: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ dueDate: 1 });

const Task =
  (mongoose.models.Task as mongoose.Model<ITask> | undefined) ||
  mongoose.model<ITask>("Task", taskSchema);

export = Task;
