import mongoose = require("mongoose");

const taskPriorities = ["low", "medium", "high", "urgent"] as const;
type TaskPriority = (typeof taskPriorities)[number];

interface ITaskChecklistItem {
  title: string;
  isCompleted: boolean;
}

interface ITask {
  workspace: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  column: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignees: mongoose.Types.ObjectId[];
  priority: TaskPriority;
  dueDate?: Date;
  labels: string[];
  checklist: ITaskChecklistItem[];
  position: number;
  createdBy: mongoose.Types.ObjectId;
  completedAt?: Date;
  isArchived: boolean;
}

const taskChecklistItemSchema = new mongoose.Schema<ITaskChecklistItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

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
    column: {
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
    checklist: {
      type: [taskChecklistItemSchema],
      default: [],
    },
    position: {
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
    completedAt: {
      type: Date,
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

taskSchema.index({ board: 1, column: 1, position: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ dueDate: 1 });

const Task =
  (mongoose.models.Task as mongoose.Model<ITask> | undefined) ||
  mongoose.model<ITask>("Task", taskSchema);

export = Task;
