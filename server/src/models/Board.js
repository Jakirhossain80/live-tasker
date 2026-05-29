"use strict";
const mongoose = require("mongoose");
const defaultBoardColumns = [
    { title: "Todo", order: 0 },
    { title: "In Progress", order: 1 },
    { title: "Review", order: 2 },
    { title: "Done", order: 3 },
];
const getDefaultBoardColumns = () => {
    return defaultBoardColumns.map((column) => ({ ...column }));
};
const boardColumnSchema = new mongoose.Schema({
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
}, {
    _id: true,
});
const boardSchema = new mongoose.Schema({
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
        default: getDefaultBoardColumns,
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
}, {
    timestamps: true,
    versionKey: false,
});
boardSchema.index({ workspace: 1, name: 1 });
const Board = mongoose.models.Board ||
    mongoose.model("Board", boardSchema);
module.exports = Board;
//# sourceMappingURL=Board.js.map