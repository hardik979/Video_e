import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    questions: [
      {
        questionText: { type: String, required: true },
        answers: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User", // Reference to the User model
              required: true,
            },
            answerText: { type: String, required: true },
          },
        ],
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);

export default Video;
