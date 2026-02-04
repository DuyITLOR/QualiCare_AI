import { Router, Request, Response } from "express";
import chatService from "../services/chatService.js";

const router = Router();

// Tạo session chat mới
router.post("/sessions", async (req: Request, res: Response) => {
  try {
    const { userId, title } = req.body;
    const session = await chatService.createChatSession(userId, title);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Lấy danh sách session của user
router.get("/sessions/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const sessions = await chatService.getChatSessions(userId);
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Lấy tin nhắn trong session
router.get(
  "/sessions/:sessionId/messages",
  async (req: Request, res: Response) => {
    try {
      const sessionId = String(req.params.sessionId);
      const messages = await chatService.getChatMessages(sessionId);
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Gửi tin nhắn
router.post(
  "/sessions/:sessionId/messages",
  async (req: Request, res: Response) => {
    try {
      const sessionId = String(req.params.sessionId);
      const { message } = req.body;

      if (!message || !message.trim()) {
        res.status(400).json({
          success: false,
          error: "Tin nhắn không được để trống",
        });
        return;
      }

      const result = await chatService.sendMessage(sessionId, message.trim());
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Cập nhật tiêu đề session
router.put("/sessions/:sessionId", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId);
    const { title } = req.body;
    const session = await chatService.updateSessionTitle(sessionId, title);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Xóa một session
router.delete("/sessions/:sessionId", async (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.sessionId);
    const result = await chatService.deleteSession(sessionId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Xóa tất cả sessions của user
router.delete("/sessions/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const result = await chatService.deleteAllSessions(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
