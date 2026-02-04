import { Router, Request, Response } from "express";
import * as authService from "../services/authService.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, phoneNumber, name, date } = req.body;
    const data = await authService.register(
      email,
      password,
      phoneNumber,
      name,
      date,
    );
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
