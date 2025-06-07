import express from "express"
import {authMiddleware} from "../middlewares/auth.middlewares.js"
import { executeCode } from "../controllers/executeCode.controllers.js"

const executeCodeRoutes=express.Router()

executeCodeRoutes.post("/", authMiddleware, executeCode)

export default executeCodeRoutes