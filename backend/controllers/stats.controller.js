import Video from "../models/Question.model.js"; // Correct reference
import User from "../models/user.model.js";

export const getVideoStats = async (req, res) => {
  try {
    const videoStats = await Video.aggregate([
      {
        $unwind: "$questions", // Unwind questions to handle them individually
      },
      {
        $unwind: "$questions.answers", // Unwind answers to handle them individually
      },
      {
        $group: {
          _id: "$videoUrl", // Group by video URL or you can group by _id
          totalAnswers: { $sum: 1 }, // Count total answers for the video
          totalQuestions: { $sum: 1 }, // Count total questions
        },
      },
      {
        $project: {
          videoUrl: "$_id",
          totalAnswers: 1,
          totalQuestions: 1,
        },
      },
    ]);

    res.json({ videoStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching video statistics" });
  }
};

export const userStats = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "videos", // Lookup videos that users have interacted with
          localField: "_id", // Match user _id with answers
          foreignField: "questions.answers.userId",
          as: "videosAnswered", // List of videos the user has answered
        },
      },
      {
        $project: {
          name: 1,
          totalAnswers: { $size: "$videosAnswered" }, // Count number of answered videos
        },
      },
    ]);

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user statistics" });
  }
};

export const questionInsights = async (req, res) => {
  try {
    const questionInsights = await Video.aggregate([
      {
        $unwind: "$questions", // Unwind questions
      },
      {
        $unwind: "$questions.answers", // Unwind answers
      },
      {
        $group: {
          _id: "$questions._id", // Group by question _id
          totalAnswers: { $sum: 1 }, // Count answers for each question
          correctAnswers: {
            $sum: {
              $cond: [{ $eq: ["$questions.answers.isCorrect", true] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "questions", // Lookup question details
          localField: "_id",
          foreignField: "_id",
          as: "questionDetails",
        },
      },
      {
        $project: {
          questionText: { $arrayElemAt: ["$questionDetails.questionText", 0] },
          totalAnswers: 1,
          correctAnswers: 1,
        },
      },
    ]);

    res.json({ questionInsights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching question insights" });
  }
};
