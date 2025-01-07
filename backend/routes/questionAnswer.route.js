import express from "express";
const router = express.Router();
import {
  addVideoWithQuestions,
  answerQuestion,
  getVideosWithQuestions,
} from "../controllers/question.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
router.post("/add-video", protectRoute, addVideoWithQuestions);
router.get("/video", protectRoute, getVideosWithQuestions);
router.post("/answer", protectRoute, answerQuestion);
export default router;
