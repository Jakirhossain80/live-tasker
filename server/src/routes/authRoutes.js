"use strict";
const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware.protect, authController.me);
router.patch("/me", authMiddleware.protect, authController.updateMe);
router.patch("/password", authMiddleware.protect, authController.updatePassword);
module.exports = router;
//# sourceMappingURL=authRoutes.js.map