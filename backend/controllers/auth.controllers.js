import bcrypt from "bcryptjs";
import { db } from "../src/libs/db.js";
import { UserRole } from "../src/generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User created succesfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({
      error: "Error occured while creating user",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        error: "User does not exist. Please create an account",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User logged in succesfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error occured in login", error);
    return res.status(501).json({
      error: "some error occured while logging in",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out succesfully",
    });
  } catch (error) {
    console.error("error occured while logging out", error);
    return res.status(501).json({
      error: "internal error logging out",
    });
  }
};

export const check = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User Authenticated ",
      user: req.user,
    });
  } catch (error) {
    console.error("Error Checking User Authenticated Or Not", error);
    return res.status(500).json({
      error: "Error Checking User Authenticated Or Not",
    });
  }
};
