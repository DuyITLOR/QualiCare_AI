import { Request, Response } from "express";
import * as authService from "../services/authService.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, phoneNumber, name, date } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await authService.signup(
      email,
      password,
      phoneNumber,
      name,
      date,
    );

    res.status(201).json({
      message: "Signup successful",
      token: result.token,
      userId: result.user.userId,
    });
  } catch (error: any) {
    if (error.message === "The account already exists") {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await authService.signin(email, password);

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      userId: result.userId,
    });
  } catch (error: any) {
    if (
      error.message === "The account does not exist" ||
      error.message === "Incorrect password"
    ) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
