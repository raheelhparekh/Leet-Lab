import express from "express"
import { authMiddleware } from "../middlewares/auth.middlewares.js"
import {getAllSubmissionsForUser,getSubmissionForProblem,getAllSubmissionsForProblem} from "../controllers/submission.controllers.js"

const submissionRoutes=express.Router()

submissionRoutes.get("/get-all-submissions-of-user",authMiddleware,getAllSubmissionsForUser)
submissionRoutes.get("/get-submission/:problemId",authMiddleware,getSubmissionForProblem)
submissionRoutes.get("/get-submissions-count/:problemId",authMiddleware,getAllSubmissionsForProblem)

export default submissionRoutes