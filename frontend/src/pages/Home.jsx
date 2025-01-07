import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { BarLoader } from "../components/Loader";

const Home = () => {
  const [videos, setVideos] = useState([]); // Store videos and questions
  const [currentIndex, setCurrentIndex] = useState(0); // Track current video index
  const [answers, setAnswers] = useState([]); // Track answers for the current video
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message

  useEffect(() => {
    // Fetch videos and questions on component mount
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/questions/video");
        setVideos(response.data.videos); // Set videos from the API response
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch videos. Please try again.");
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle "Next" button click
  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setAnswers([]); // Reset answers for the new video
    } else {
      toast.success("Videos completed!");
    }
  };

  // Handle "Previous" button click
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setAnswers([]); // Reset answers for the new video
    }
  };

  // Handle input change for answers
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle "Submit Answers" button click
  const handleAnswerSubmit = async () => {
    const currentVideo = videos[currentIndex];

    if (answers.length !== currentVideo.questions.length) {
      toast.error("Please answer all the questions before submitting.");
      return;
    }

    try {
      const response = await axiosInstance.post("/questions/answer", {
        videoId: currentVideo._id,
        answers,
      });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit answers. Try again."
      );
    }
  };

  // If loading, show a loader
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <BarLoader />
      </div>
    );
  }

  // If there's an error, display it
  if (error) {
    return <p>{error}</p>;
  }

  // If no videos are available, show a message
  if (videos.length === 0) {
    return <p>No videos found.</p>;
  }

  // Current video and its questions
  const currentVideo = videos[currentIndex];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/5 bg-gradient-to-br from-pink-500 to-purple-500 p-4">
        <h2 className="text-lg font-bold mb-4 text-center md:text-left">
          Menu
        </h2>
        <nav>
          <ul className="space-y-2">
            <li className="p-2 bg-pink-300 rounded-md hover:bg-pink-400 cursor-pointer">
              Home
            </li>
            <li className="p-2 bg-pink-300 rounded-md hover:bg-pink-400 cursor-pointer">
              Current Event
            </li>
            <li className="p-2 bg-pink-300 rounded-md hover:bg-pink-400 cursor-pointer">
              Old Events
            </li>
            <li className="p-2 bg-pink-300 rounded-md hover:bg-pink-400 cursor-pointer">
              Video Page
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="bg-white rounded-md shadow-md p-4">
          {/* Video Section */}
          {currentVideo && (
            <div>
              <iframe
                className="w-full h-64 md:h-80 rounded-md"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                src={currentVideo.videoUrl.replace("watch?v=", "embed/")}
              ></iframe>
              <h3 className="text-lg font-bold mt-4">
                Video {currentIndex + 1}
              </h3>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="mt-6 space-y-4">
          {currentVideo.questions.length > 0 ? (
            currentVideo.questions.map((question, index) => (
              <div
                className="bg-white rounded-md shadow-md p-4"
                key={question._id}
              >
                <h4 className="font-semibold">{`Q${index + 1}: ${
                  question.questionText
                }`}</h4>
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-md shadow-md p-4">
              <h4 className="font-semibold">No questions available</h4>
            </div>
          )}
        </div>

        {/* Submit and Video Navigation Buttons */}
        <div className="mt-6 text-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={handleAnswerSubmit}
          >
            Submit Answers
          </button>
          <div className="mt-4 flex justify-center space-x-4">
            {currentIndex > 0 && (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={handlePrev}
              >
                Previous Video
              </button>
            )}
            {currentIndex < videos.length - 1 && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleNext}
              >
                Next Video
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-full md:w-1/5 bg-white p-4 border-l border-gray-200 hidden md:block">
        <h3 className="font-bold mb-4">Old Events</h3>
        <ul className="space-y-4">
          <li className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div>
              <p className="font-semibold">Event Title 1</p>
              <p className="text-sm text-gray-600">Details...</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div>
              <p className="font-semibold">Event Title 2</p>
              <p className="text-sm text-gray-600">Details...</p>
            </div>
          </li>
          <li className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
            <div>
              <p className="font-semibold">Event Title 3</p>
              <p className="text-sm text-gray-600">Details...</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Home;
