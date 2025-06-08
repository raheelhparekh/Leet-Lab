import express from "express"
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js"
import { 
    createProblem,
    getAllProblems,
    getProblemById,
    deleteProblem,
    updateProblem,
    getAllSolvedProblemsByUser
} from "../controllers/problem.controllers.js"

const problemRoutes=express.Router();

problemRoutes.post("/create-problem",authMiddleware,checkAdmin,createProblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id",authMiddleware, getProblemById);

problemRoutes.delete("/delete-problem/:id",authMiddleware,checkAdmin,deleteProblem);

problemRoutes.put("/update-problem/:id",authMiddleware,checkAdmin,updateProblem);

problemRoutes.get("/get-all-solved-problems-by-user",authMiddleware,getAllSolvedProblemsByUser);

export default problemRoutes