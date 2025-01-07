import express from "express";
import {
  getVideoStats,
  questionInsights,
  userStats,
} from "../controllers/stats.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/videoStats", protectRoute, getVideoStats);
router.get("/userStats", protectRoute, userStats);
router.get("/questionInsights", protectRoute, questionInsights);

export default router;
