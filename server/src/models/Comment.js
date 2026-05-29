"use strict";
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
commentSchema.index({ task: 1, createdAt: -1 });
const Comment = mongoose.models.Comment ||
    mongoose.model("Comment", commentSchema);
module.exports = Comment;
//# sourceMappingURL=Comment.js.map