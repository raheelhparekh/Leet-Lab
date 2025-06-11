import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAction = create((set) => ({
  isDeletingProblem: false,
  isUpdatingProblem: false,

  onDeleteProblem: async (problemId) => {
    try {
      set({ isDeletingProblem: true });
      const response = await axiosInstance.delete(`/problems/delete-problem/${problemId}`);
      //   console.log(response);
      toast.success(response.data.message || "Problem deleted succesfully");
    } catch (error) {
      console.log("Error occured while deleting problem", error);
      toast.error("Could not delete problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },

  onUpdateProblem:async(problemId)=>{
    try {
      set({ isUpdatingProblem: true });
      const response = await axiosInstance.put(`/problems/update-problem/${problemId}`);
      //   console.log(response);
      toast.success(response.data.message || "Problem updated succesfully");
    } catch (error) {
      console.log("Error occured while updating problem", error);
      toast.error("Could not update problem");
    } finally {
      set({ isUpdatingProblem: false });
    }
  }
}));
