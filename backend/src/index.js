import express from "express"
import dotenv from "dotenv"
import authRoutes from "../routes/auth.routes.js"

dotenv.config()

const app=express()
const PORT=process.env.PORT || 8000

app.use(express.json())

app.get('/',(req,res)=>{
    res.send(" hello welcome to leetlab")
})

app.use("/api/v1/auth",authRoutes )

app.listen(PORT,()=>{
    console.log(`Server is runing on Port : ${PORT}`)
})