import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios"; // import axiosInstance
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [videoStats, setVideoStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [questionInsights, setQuestionInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoResponse = await axiosInstance.get("/admin/videoStats");
        const userResponse = await axiosInstance.get("/admin/userStats");
        const questionResponse = await axiosInstance.get(
          "/admin/questionInsights"
        );

        setVideoStats(videoResponse.data.videoStats);
        setUserStats(userResponse.data.users);
        setQuestionInsights(questionResponse.data.questionInsights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Chart Data for Video Stats
  const videoData = {
    labels: videoStats.map((stat) => stat.videoUrl),
    datasets: [
      {
        label: "Total Answers",
        data: videoStats.map((stat) => stat.totalAnswers),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart Data for Question Insights
  const questionData = {
    labels: questionInsights.map((stat) => stat._id),
    datasets: [
      {
        label: "Total Answers",
        data: questionInsights.map((stat) => stat.totalAnswers),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Correct Answers",
        data: questionInsights.map((stat) => stat.correctAnswers),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Analytics Dashboard
      </h1>

      {/* Summary Boxes (including Question Insights) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Video Stats Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Video Stats Summary</h2>
          <ul className="space-y-2">
            <li>Total Videos: {videoStats.length}</li>
            <li>
              Total Answers:{" "}
              {videoStats.reduce((acc, stat) => acc + stat.totalAnswers, 0)}
            </li>
            <li>
              Total Questions:{" "}
              {videoStats.reduce((acc, stat) => acc + stat.totalQuestions, 0)}
            </li>
          </ul>
        </div>

        {/* User Stats Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">User Stats Summary</h2>
          <ul className="space-y-2">
            <li>Total Users: {userStats.length}</li>
            <li>
              Total Users Who Answered:{" "}
              {userStats.filter((user) => user.totalAnswers > 0).length}
            </li>
          </ul>
        </div>

        {/* Question Insights Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Question Insights Summary
          </h2>
          <ul className="space-y-2">
            <li>Total Questions: {questionInsights.length}</li>
            <li>
              Total Answers:{" "}
              {questionInsights.reduce(
                (acc, stat) => acc + stat.totalAnswers,
                0
              )}
            </li>
            <li>
              Total Correct Answers:{" "}
              {questionInsights.reduce(
                (acc, stat) => acc + stat.correctAnswers,
                0
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Video Stats Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Bar data={videoData} />
        </div>

        {/* Question Insights Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <Pie data={questionData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
