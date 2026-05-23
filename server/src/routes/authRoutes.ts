import express = require("express");
import authController = require("../controllers/authController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware.protect, authController.me);
router.patch("/me", authMiddleware.protect, authController.updateMe);
router.patch("/password", authMiddleware.protect, authController.updatePassword);

export = router;
