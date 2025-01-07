import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons
import { toast } from "react-hot-toast";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required.");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required.");
      return;
    }
    login(formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {/* Main Container */}
      <div className="bg-white shadow-lg rounded-lg flex flex-col lg:flex-row max-w-5xl w-full">
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center items-center p-8 lg:p-12 w-full lg:w-1/2">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-gray-600">Login to continue further</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {/* Eye Icon for toggling password visibility */}
                <span
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute right-3 top-10 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                  {/* Display open or closed eye */}
                </span>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <>Loading...</> : "Login"}
              </button>
            </form>
            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image and Text */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-r-lg flex-col justify-center items-center text-white p-8">
          <img src="/content.png" alt="Illustration" className="w-3/4 mb-6" />
          <h2 className="text-xl font-semibold text-center">
            Download videos effortlessly
          </h2>
          <p className="text-sm text-center mt-2">
            Explore and access video content with ease, anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
