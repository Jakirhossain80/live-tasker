"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const refreshTokenCookieName = "refreshToken";
const getRequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is not defined`);
    }
    return value;
};
const createAccessToken = (userId) => {
    const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || "15m");
    return jwt.sign({ userId }, getRequiredEnv("JWT_ACCESS_SECRET"), { expiresIn });
};
const createRefreshToken = (userId) => {
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || "7d");
    return jwt.sign({ userId }, getRequiredEnv("JWT_REFRESH_SECRET"), { expiresIn });
};
const createAuthTokens = (userId) => {
    return {
        accessToken: createAccessToken(userId),
        refreshToken: createRefreshToken(userId),
    };
};
const verifyAccessToken = (token) => {
    return jwt.verify(token, getRequiredEnv("JWT_ACCESS_SECRET"));
};
const verifyRefreshToken = (token) => {
    return jwt.verify(token, getRequiredEnv("JWT_REFRESH_SECRET"));
};
const getPublicUser = (user) => {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
    };
};
const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        const error = new Error("A user with this email already exists");
        Object.assign(error, { statusCode: 409 });
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
    });
    return {
        user: getPublicUser(user),
        tokens: createAuthTokens(String(user._id)),
    };
};
const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
        const error = new Error("Invalid email or password");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    if (!user.isActive) {
        const error = new Error("This account is inactive");
        Object.assign(error, { statusCode: 403 });
        throw error;
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    user.lastLoginAt = new Date();
    await user.save();
    return {
        user: getPublicUser(user),
        tokens: createAuthTokens(String(user._id)),
    };
};
const refresh = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    let payload;
    try {
        payload = verifyRefreshToken(refreshToken);
    }
    catch {
        const error = new Error("Invalid or expired refresh token");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
        const error = new Error("Invalid refresh token");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    return {
        user: getPublicUser(user),
        tokens: createAuthTokens(String(user._id)),
    };
};
const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
        const error = new Error("User not found");
        Object.assign(error, { statusCode: 404 });
        throw error;
    }
    return getPublicUser(user);
};
const updateMe = async (userId, { name, email }) => {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
        const error = new Error("User not found");
        Object.assign(error, { statusCode: 404 });
        throw error;
    }
    if (name !== undefined) {
        user.name = name.trim();
    }
    if (email !== undefined) {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: user._id },
        });
        if (existingUser) {
            const error = new Error("A user with this email already exists");
            Object.assign(error, { statusCode: 409 });
            throw error;
        }
        user.email = normalizedEmail;
    }
    await user.save();
    return getPublicUser(user);
};
const updatePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select("+password");
    if (!user || !user.isActive) {
        const error = new Error("User not found");
        Object.assign(error, { statusCode: 404 });
        throw error;
    }
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
        const error = new Error("Current password is incorrect");
        Object.assign(error, { statusCode: 401 });
        throw error;
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
};
module.exports = {
    refreshTokenCookieName,
    register,
    login,
    refresh,
    getMe,
    updateMe,
    updatePassword,
    verifyAccessToken,
};
//# sourceMappingURL=authService.js.map