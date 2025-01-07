import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore"; // Assuming Zustand is used
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    pincode: "",
    district: "",
    state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp, checkAuth } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.pincode.length === 0)
      return toast.error("Pincode is required");
    if (formData.district.length === 0)
      return toast.error("District is required");
    if (formData.state.length === 0) return toast.error("State is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (checkAuth) return toast.error("You are already logged in");
    const success = validateForm();
    if (success === true) {
      signup(formData);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {/* Main Container */}
      <div className="bg-white shadow-lg rounded-lg flex flex-col lg:flex-row max-w-5xl w-full">
        {/* Left Side - Signup Form */}
        <div className="flex flex-col justify-center items-center p-8 lg:p-12 w-full lg:w-1/2">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-gray-600">
                Get started with your free account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

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

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <span
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute right-3 top-10 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Pincode */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter Pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>

              {/* District and State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter District"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSigningUp}
              >
                {isSigningUp ? "Loading..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image and Text */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-r-lg flex-col justify-center items-center text-white p-8">
          <img src="/content.png" alt="Illustration" className="w-3/4 mb-6" />
          <h2 className="text-xl font-semibold text-center">Join us today</h2>
          <p className="text-sm text-center mt-2">
            Discover the power of personalization and convenience in every step.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
