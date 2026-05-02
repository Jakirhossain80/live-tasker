import mongoose = require("mongoose");

interface IComment {
  task: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  isEdited: boolean;
  editedAt?: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

commentSchema.index({ task: 1, createdAt: -1 });

const Comment =
  (mongoose.models.Comment as mongoose.Model<IComment> | undefined) ||
  mongoose.model<IComment>("Comment", commentSchema);

export = Comment;
