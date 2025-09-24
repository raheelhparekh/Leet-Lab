import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissionsForUser: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/submission/get-all-submissions-of-user");

      set({ submissions: response.data.submissions });
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/submission/get-submission/${problemId}`);

      set({ submission: response.data.submissions });
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const response = await axiosInstance.get(`/submission/get-submissions-count/${problemId}`);

      set({ submissionCount: response.data.submissions });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },

  submitSolution: async (problemId, code, languageId) => {
    try {
      set({ isLoading: true });
      
      // Get the problem details to get test cases
      const problemResponse = await axiosInstance.get(`/problem/get-problem/${problemId}`);
      const problem = problemResponse.data.problem;
      
      if (!problem || !problem.testCases || problem.testCases.length === 0) {
        throw new Error("Problem not found or no test cases available");
      }
      
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      
      const response = await axiosInstance.post("/execute-code", {
        problemId,
        source_code: code,
        language_id: languageId,
        stdin,
        expected_outputs,
      });

      // Add the new submission to the submissions array
      set((state) => ({
        submissions: [response.data.submission, ...state.submissions]
      }));

      toast.success(response.data.message || "Solution submitted successfully!");
      return response.data.submission;
    } catch (error) {
      console.log("Error submitting solution", error);
      toast.error(error.response?.data?.error || "Error submitting solution");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));