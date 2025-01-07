import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoadingVideos: false,
  videos: [],
  currentVideoIndex: 0,
  currentVideo: null,
  currentQuestions: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed");
    }
  },

  fetchVideosAndQuestions: async () => {
    set({ isLoadingVideos: true });
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/questions/video", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.videos) {
        set({
          videos: res.data.videos,
          currentVideo: res.data.videos[0],
          currentQuestions: res.data.videos[0]?.questions || [],
        });
        toast.success("Videos and questions fetched successfully!");
      } else {
        toast.error("No videos found.");
        set({ videos: [], currentVideo: null, currentQuestions: [] });
      }
    } catch (error) {
      console.log("Error fetching videos and questions:", error);
      toast.error("Failed to fetch videos and questions.");
    } finally {
      set({ isLoadingVideos: false });
    }
  },

  nextVideo: () => {
    const state = get();
    const nextIndex = state.currentVideoIndex + 1;

    if (nextIndex < state.videos.length) {
      set({
        currentVideo: state.videos[nextIndex],
        currentQuestions: state.videos[nextIndex].questions,
        currentVideoIndex: nextIndex,
      });
    } else {
      toast.error("No more videos available.");
    }
  },

  submitAnswers: async (videoId, answers) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/questions/answer",
        { videoId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Answers submitted successfully!");
    } catch (error) {
      console.log("Error submitting answers:", error);
      toast.error("Failed to submit answers.");
    }
  },

  addVideo: async (videoData) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/questions/add-video",
        { videoUrl: videoData.videoUrl, questions: videoData.questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      set((state) => ({
        videos: [...state.videos, videoData],
      }));
      toast.success("Video and questions uploaded successfully!");
    } catch (error) {
      console.log("Error uploading video:", error);
      toast.error("Failed to upload video.");
    }
  },
}));
