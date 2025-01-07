import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { BarLoader } from "./components/Loader";
import AdminUpload from "./pages/AdminUpload";
import AnalyticsDashboard from "./pages/Analytic";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth)
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader />
      </div>
    );
  return (
    <Router>
      {authUser && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            // Only allow access if the user is an admin
            authUser && useAuthStore.getState().authUser?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Link to={"/login"} />
            )
          }
        />
        <Route
          path="/analytic"
          element={
            // Only allow access if the user is an admin
            authUser && useAuthStore.getState().authUser?.role === "admin" ? (
              <AnalyticsDashboard />
            ) : (
              <Link to={"/login"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
