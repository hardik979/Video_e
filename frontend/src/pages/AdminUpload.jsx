import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; // Import your zustand store
import { v4 as uuidv4 } from "uuid"; // Import UUID library for unique ids
import toast from "react-hot-toast"; // Import react-hot-toast

const AdminUpload = () => {
  const { addVideo } = useAuthStore((state) => state); // Zustand action to add video data

  // State variables for form input
  const [videoUrl, setVideoUrl] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", id: uuidv4() },
    { text: "", id: uuidv4() },
    { text: "", id: uuidv4() },
  ]);

  // Handle video URL change
  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  // Handle question change
  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].text = e.target.value;
    setQuestions(newQuestions);
  };

  // Add new question field
  const addQuestionField = () => {
    setQuestions([...questions, { text: "", id: uuidv4() }]);
  };

  // Remove question field
  const removeQuestionField = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (videoUrl && questions.every((q) => q.text.trim() !== "")) {
      // Format the questions as an array of strings
      const formattedQuestions = questions.map((q) => q.text.trim());

      // Add video and questions to store
      addVideo({ videoUrl, questions: formattedQuestions });

      // Clear form after submission
      setVideoUrl("");
      setQuestions([
        { text: "", id: uuidv4() },
        { text: "", id: uuidv4() },
        { text: "", id: uuidv4() },
      ]); // Reset to 3 empty questions

      // Show success toast
      toast.success("Video and questions uploaded successfully!");
    } else {
      toast.error("Please fill all fields!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-3 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Upload Video and Questions
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter YouTube video URL"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Questions</label>
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-center mb-2">
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={`Question ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeQuestionField(index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default AdminUpload;
