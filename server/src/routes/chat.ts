const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Create new session
router.post('/sessions', async (req, res) => {
  try {
    const { userId, title } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const session = await chatService.createChatSession(userId, title);
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user sessions
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await chatService.getChatSessions(userId);
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get messages for session
router.get('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await chatService.getChatMessages(sessionId);
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send message - ENHANCED với Elasticsearch
router.post('/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    console.log(`Processing message for session ${sessionId}`);
    console.log('Message:', message);

    const result = await chatService.sendMessage(sessionId, message.trim());
    
    // Log thông tin về việc sử dụng knowledge base
    if (result.botMessage?.hasKnowledgeBase) {
      console.log('✅ Used Elasticsearch knowledge base');
      console.log('Sources:', result.botMessage.sources?.length || 0);
    } else {
      console.log('ℹ️ Used Gemini general knowledge');
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete session
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await chatService.deleteSession(sessionId);
    
    res.json({
      success: true,
      data: { message: 'Session deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete all sessions for user
router.delete('/sessions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await chatService.deleteAllSessions(userId);
    
    res.json({
      success: true,
      data: { message: 'All sessions deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting all sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update session title
router.put('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    const session = await chatService.updateSessionTitle(sessionId, title);
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error updating session title:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
