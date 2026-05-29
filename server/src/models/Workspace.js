"use strict";
const mongoose = require("mongoose");
const workspaceMemberRoles = ["owner", "admin", "member"];
const workspaceMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: workspaceMemberRoles,
        default: "member",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: false,
});
const workspaceSchema = new mongoose.Schema({
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    members: {
        type: [workspaceMemberSchema],
        default: [],
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
workspaceSchema.index({ "members.user": 1 });
const Workspace = mongoose.models.Workspace ||
    mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace;
//# sourceMappingURL=Workspace.js.map