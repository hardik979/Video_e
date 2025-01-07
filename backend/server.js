import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import questionRoutes from "./routes/questionAnswer.route.js";
import statisticRoutes from "./routes/stats.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up your authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", statisticRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
