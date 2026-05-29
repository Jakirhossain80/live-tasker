"use strict";
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 120,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLoginAt: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.index({ email: 1 });
const User = mongoose.models.User ||
    mongoose.model("User", userSchema);
module.exports = User;
//# sourceMappingURL=User.js.map