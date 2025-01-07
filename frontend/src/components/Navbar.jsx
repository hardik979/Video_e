import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Logout and redirect to login page
  const handleLogout = () => {
    logout(); // Perform the logout action
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">Videoe</div>

        {/* Links and Icons - Aligning to the right */}
        <div className="flex items-center space-x-6 ml-auto">
          {" "}
          {/* ml-auto aligns to the right */}
          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Links */}
          <ul
            className={`lg:flex lg:space-x-6 ${
              isMenuOpen ? "block" : "hidden"
            } absolute lg:static top-16 left-0 w-full  lg:bg-transparent lg:top-0`}
          >
            <li>
              <Link to={"/"} className="block py-2 px-4 hover:underline">
                Home
              </Link>
            </li>
            {authUser?.role === "admin" && (
              <>
                <li>
                  <Link
                    to={"/admin"}
                    className="block py-2 px-4 hover:underline"
                  >
                    Upload
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/analytic"}
                    className="block py-2 px-4 hover:underline"
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            )}

            <li>
              <button
                className="block py-2 px-4 hover:underline"
                onClick={handleLogout} // Use the handleLogout function
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
