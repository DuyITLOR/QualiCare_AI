const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Tạo session chat mới
router.post('/sessions', async (req, res) => {
  try {
    const { userId, title } = req.body;
    const session = await chatService.createChatSession(userId, title);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lấy danh sách session của user
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await chatService.getChatSessions(userId);
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lấy tin nhắn trong session
router.get('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await chatService.getChatMessages(sessionId);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gửi tin nhắn
router.post('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tin nhắn không được để trống' 
      });
    }

    const result = await chatService.sendMessage(sessionId, message.trim());
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cập nhật tiêu đề session
router.put('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const session = await chatService.updateSessionTitle(sessionId, title);
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xóa một session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await chatService.deleteSession(sessionId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xóa tất cả sessions của user
router.delete('/sessions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await chatService.deleteAllSessions(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;