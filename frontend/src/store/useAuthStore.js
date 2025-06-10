import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get("/auth/check");
      console.log("check auth response", response.data);

      set({ authUser: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Some error occured in checkAuth", error);
      toast.error(" Error checking authentication");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/auth/login", data);
      console.log(" login response", response.data);

      set({ authUser: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Some error occured in Logging In", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (data) => {
    try {
      set({ isSigninUp: true });
      const response = await axiosInstance.post("/auth/register", data);
      console.log("sign up response", response.data);

      set({ authUser: response.data.user });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Some error occured in Signing Up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },
  
  logout: async () => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      console.log("logout response", response.data);

      set({ authUser: null });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Some error occured in Logging Out", error);
      toast.error("Error logging out");
    }
  },
}));
