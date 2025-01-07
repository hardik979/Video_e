import mongoose from "mongoose";
import Video from "../models/Question.model.js";
import User from "../models/user.model.js";
export const addVideoWithQuestions = async (req, res) => {
  try {
    // Admin role check
    if (req.user.role !== "admin")
      return res.status(401).json({ error: "Unauthorized" });

    const { videoUrl, questions } = req.body;

    // Validate videoUrl and questions array
    if (!videoUrl || !Array.isArray(questions) || questions.length !== 3) {
      return res.status(400).json({
        error:
          "Invalid request. Ensure 'videoUrl' and exactly 3 'questions' are provided.",
      });
    }

    // Format questions to match the schema
    const formattedQuestions = questions.map((q) => ({
      questionText: q,
      answers: [], // Initialize answers as empty array
    }));

    // Create a new video entry
    const newVideo = new Video({ videoUrl, questions: formattedQuestions });
    await newVideo.save();

    // Return success response
    return res.status(201).json({
      message: "Video and questions added successfully!",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error in addVideoWithQuestions:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getVideosWithQuestions = async (req, res) => {
  try {
    // Fetch all videos from the database
    const videos = await Video.find({});

    // Check if videos exist
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found." });
    }

    // Return the videos with a success message
    return res.status(200).json({
      message: "Videos fetched successfully.",
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error("Error in getVideosWithQuestions:", error);
    return res.status(500).json({
      message: "An error occurred while fetching videos.",
      error: error.message,
    });
  }
};

export const answerQuestion = async (req, res) => {
  try {
    const { videoId, answers } = req.body;
    const userId = req.user._id; // Get the user ID from the request user object

    // Validate input
    if (!videoId || !Array.isArray(answers)) {
      return res.status(400).json({
        message:
          "Invalid request. Provide a valid videoId and an array of answers.",
      });
    }

    // Fetch the video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    // Check if answers match the number of questions
    if (answers.length !== video.questions.length) {
      return res.status(400).json({
        message: `The number of answers (${answers.length}) does not match the number of questions (${video.questions.length}).`,
      });
    }

    // Add the answers to the video
    video.questions.forEach((question, index) => {
      question.answers.push({
        answerText: answers[index], // Corrected: 'answer' -> 'answerText'
        userId: new mongoose.Types.ObjectId(userId), // Corrected: 'user' -> 'userId'
      });
    });

    // Save the updated video
    await video.save();

    // Send a success response
    return res.status(200).json({ message: "Answers submitted successfully." });
  } catch (error) {
    console.error("Error in answerQuestion:", error);
    return res.status(500).json({
      message: "An error occurred while submitting answers.",
      error: error.message,
    });
  }
};
