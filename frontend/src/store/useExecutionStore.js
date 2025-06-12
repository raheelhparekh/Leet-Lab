import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useExecutionStore = create((set) => ({
  isExecutingCode: false,
  submission: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isExecutingCode: true });
      // console.log("Submission :",JSON.stringify({source_code,language_id,stdin,expected_outputs,problemId,}),);

      const response = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ submission: response.data.submission });
      toast.success(response.data.message || " Code executed Successfully !!");
    } catch (error) {
      console.log("Error occured while executing code", error);
      toast.error("Could not execute code");
    } finally {
      set({ isExecutingCode: false });
    }
  },
}));
