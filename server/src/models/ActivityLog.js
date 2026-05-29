"use strict";
const mongoose = require("mongoose");
const activityActions = [
    "created",
    "updated",
    "deleted",
    "moved",
    "commented",
    "assigned",
    "completed",
];
const activityEntityTypes = ["workspace", "board", "task", "comment"];
const activityLogSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
activityLogSchema.index({ workspace: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
const ActivityLog = mongoose.models.ActivityLog ||
    mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
//# sourceMappingURL=ActivityLog.js.map