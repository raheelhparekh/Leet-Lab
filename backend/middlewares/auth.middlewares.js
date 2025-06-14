import jwt from "jsonwebtoken";
import { db } from "../src/libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorised , no token found",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log("decoded ", decoded);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorised, invalid token",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("error authenticating user", error);
    return res.status(500).json({
      error: "Error authenticating user",
    });
  }
};

export const checkAdmin=async(req,res,next)=>{
  try {

    if(req.user.role !=="ADMIN"){
      return res.status(403).json({
        message:"You are not an admin"
      })
    }

    next();
    
  } catch (error) {
    console.error(" Some error occured in checking user role")
    return res.status(501).json({
      error:"Error occured while checking user role"
    })
    
  }
}