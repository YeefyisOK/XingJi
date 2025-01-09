const moment = require('moment');

class ConversationService {
  constructor() {
    this.conversations = new Map();
    this.messageLimit = 20;
  }

  getOrCreateConversation(userId) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, {
        messages: [],
        lastActivity: moment(),
        messageCount: 0
      });
    }
    return this.conversations.get(userId);
  }

  addMessage(userId, message, isUser = true) {
    const conversation = this.getOrCreateConversation(userId);
    conversation.messages.push({
      role: isUser ? 'user' : 'assistant',
      content: message,
      timestamp: moment().valueOf()
    });

    conversation.lastActivity = moment();
    conversation.messageCount++;

    // Keep only last N messages
    if (conversation.messages.length > this.messageLimit) {
      conversation.messages = conversation.messages.slice(-this.messageLimit);
    }

    return conversation.messages;
  }

  getConversationHistory(userId) {
    const conversation = this.conversations.get(userId);
    return conversation ? conversation.messages : [];
  }

  clearConversation(userId) {
    this.conversations.delete(userId);
  }

  // Clean up old conversations (call this periodically)
  cleanupOldConversations() {
    const oneDayAgo = moment().subtract(1, 'day');
    for (const [userId, conversation] of this.conversations.entries()) {
      if (conversation.lastActivity.isBefore(oneDayAgo)) {
        this.conversations.delete(userId);
      }
    }
  }
}

module.exports = new ConversationService(); 