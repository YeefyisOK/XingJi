const openaiService = require('../services/openaiService');
const lingyiService = require('../services/lingyiService');
const conversationService = require('../services/conversationService');

class ChatController {
  constructor() {
    // Choose which service to use
    this.aiService = lingyiService; // or openaiService
  }

  async handleChat(req, res) {
    try {
      const { message, userId, personality } = req.body;

      if (!message || !userId || !personality) {
        return res.status(400).json({ error: '缺少必要参数' });
      }

      // Add user message to conversation
      const messages = conversationService.addMessage(userId, message);

      // Generate AI response using the selected service
      const reply = await this.aiService.generateResponse(messages, personality);

      // Add AI response to conversation
      conversationService.addMessage(userId, reply, false);

      res.json({ reply });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
  }

  async clearHistory(req, res) {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: '缺少用户ID' });
      }

      conversationService.clearConversation(userId);
      res.json({ message: '对话历史已清除' });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ error: '清除历史失败' });
    }
  }

  async getHistory(req, res) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: '缺少用户ID' });
      }

      const history = conversationService.getConversationHistory(userId);
      res.json({ history });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: '获取历史记录失败' });
    }
  }
}

module.exports = new ChatController(); 