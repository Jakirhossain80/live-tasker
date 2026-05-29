import express = require("express");
import aiController = require("../controllers/aiController");
import authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/generate-description", aiController.generateDescription);

export = router;
