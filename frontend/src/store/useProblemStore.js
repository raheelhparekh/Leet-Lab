import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  isProblemsLoading: false,
  isProblemLoading: false,
  isSolvedProblemsLoading: false,
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

  getAllSolvedProblemsByUser: async () => {
    try {
      set({ isSolvedProblemsLoading: true });
      const response = await axiosInstance.get(`/problems/get-all-solved-problems-by-user`);
      set({ solvedProblems: response.data.problem });
    } catch (error) {
      console.log("Error fetching all solved problems by user", error);
      toast.error("Error fetching all solved problems by user");
    } finally {
      set({ isSolvedProblemsLoading: false });
    }
  },

  createProblem: async (problemData) => {
    try {
      set({ isProblemsLoading: true });
      const response = await axiosInstance.post("/problems/create-problem", problemData);
      
      set((state) => ({
        problems: [...state.problems, response.data.problem]
      }));
      
      toast.success("Problem created successfully!");
      return response.data.problem;
    } catch (error) {
      console.log("Error creating problem", error);
      toast.error(error.response?.data?.error || "Error creating problem");
      throw error;
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  updateProblem: async (problemId, problemData) => {
    try {
      set({ isProblemsLoading: true });
      const response = await axiosInstance.put(`/problems/update-problem/${problemId}`, problemData);
      
      set((state) => ({
        problems: state.problems.map(p => p.id === problemId ? response.data.problem : p),
        problem: response.data.problem
      }));
      
      toast.success("Problem updated successfully!");
      return response.data.problem;
    } catch (error) {
      console.log("Error updating problem", error);
      toast.error(error.response?.data?.error || "Error updating problem");
      throw error;
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  deleteProblem: async (problemId) => {
    try {
      set({ isProblemsLoading: true });
      await axiosInstance.delete(`/problems/delete-problem/${problemId}`);
      
      set((state) => ({
        problems: state.problems.filter(p => p.id !== problemId)
      }));
      
      toast.success("Problem deleted successfully!");
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error(error.response?.data?.error || "Error deleting problem");
      throw error;
    } finally {
      set({ isProblemsLoading: false });
    }
  },
}));
