import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  isSolvedProblemsLoading:false,
  solvedProblems: [],

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const response = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: response.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error fetching all problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (problemId) => {
    try {
      set({ isProblemLoading: true });

      const response = await axiosInstance.get(`/problems/get-problem/${problemId}`);

      set({ problem: response.data.problem });
    } catch (error) {
      console.log("Error fetching problem with this id", error);
      toast.error("Error fetching problem with this id");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblems: async () => {
    try {
      set({isSolvedProblemsLoading:true})
      const response = await axiosInstance.get(`/problems//get-all-solved-problems-by-user`);
      set({ solvedProblems: response.data.problem });
    } catch (error) {
      console.log("Error fetching all solved problems by user", error);
      toast.error("Error fetching all solved problems by user");
    } finally{
        set({isSolvedProblemsLoading:false})
    }
  },
}));
