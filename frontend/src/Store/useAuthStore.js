import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (err) {
      console.log("error in check auth", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(
        "Error creating account: " +
          (error.response?.data?.message || error.message)
      );
      console.log("error in sign up", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(
        "Error logging in: " + (error.response?.data?.message || error.message)
      );
      console.log("error in login", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout"); // Change GET to POST for logout request
      set({ authUser: null }); // Reset authUser state
      toast.success(res.data.message); // Display success message
    } catch (error) {
      toast.error(
        "Error logging out: " + (error.response?.data?.message || error.message)
      );
      console.log("error in logout", error);
    }
  },
}));
