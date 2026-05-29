"use strict";
const express = require("express");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.use(authMiddleware.protect);
router.post("/generate-description", aiController.generateDescription);
module.exports = router;
//# sourceMappingURL=aiRoutes.js.map