import express from "express"
import { getMe, login, logout, register } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middlewares/auth.middlewares.js"

const authRoutes=express.Router()

authRoutes.post("/register",register)
authRoutes.post("/login",login)
authRoutes.get("/logout",authMiddleware,logout)
authRoutes.get("/get-me",authMiddleware,getMe)


export default authRoutes