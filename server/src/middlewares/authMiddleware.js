"use strict";
const authService = require("../services/authService");
const protect = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader?.startsWith("Bearer ")) {
        res.status(401);
        next(new Error("Access token is required"));
        return;
    }
    try {
        const token = authorizationHeader.slice("Bearer ".length).trim();
        const payload = authService.verifyAccessToken(token);
        req.user = {
            id: payload.userId,
        };
        next();
    }
    catch {
        res.status(401);
        next(new Error("Invalid or expired access token"));
    }
};
module.exports = {
    protect,
};
//# sourceMappingURL=authMiddleware.js.map