import mongoose = require("mongoose");

interface IBoardColumn {
  title: string;
  order: number;
}

interface IBoard {
  workspace: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  columns: IBoardColumn[];
  createdBy: mongoose.Types.ObjectId;
  isArchived: boolean;
}

const boardColumnSchema = new mongoose.Schema<IBoardColumn>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  },
);

const boardSchema = new mongoose.Schema<IBoard>(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    columns: {
      type: [boardColumnSchema],
      default: [
        { title: "To Do", order: 0 },
        { title: "In Progress", order: 1 },
        { title: "Done", order: 2 },
      ],
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

boardSchema.index({ workspace: 1, name: 1 });

const Board =
  (mongoose.models.Board as mongoose.Model<IBoard> | undefined) ||
  mongoose.model<IBoard>("Board", boardSchema);

export = Board;
