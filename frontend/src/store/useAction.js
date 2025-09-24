import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAction = create((set) => ({
  isDeletingProblem: false,
  isUpdatingProblem: false,

  onDeleteProblem: async (problemId, refreshCallback) => {
    try {
      set({ isDeletingProblem: true });
      const response = await axiosInstance.delete(`/problems/delete-problem/${problemId}`);
      toast.success(response.data.message || "Problem deleted successfully");
      
      // Call the refresh callback if provided
      if (refreshCallback) {
        refreshCallback();
      }
    } catch (error) {
      console.log("Error occurred while deleting problem", error);
      toast.error("Could not delete problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },

  onUpdateProblem:async(problemId, refreshCallback)=>{
    try {
      set({ isUpdatingProblem: true });
      const response = await axiosInstance.put(`/problems/update-problem/${problemId}`);
      toast.success(response.data.message || "Problem updated successfully");
      
      // Call the refresh callback if provided
      if (refreshCallback) {
        refreshCallback();
      }
    } catch (error) {
      console.log("Error occurred while updating problem", error);
      toast.error("Could not update problem");
    } finally {
      set({ isUpdatingProblem: false });
    }
  }
}));
