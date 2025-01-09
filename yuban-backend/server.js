const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { chatLimiter } = require('./src/middleware/rateLimiter');
const chatController = require('./src/controllers/chatController');
const conversationService = require('./src/services/conversationService');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/chat', chatLimiter, chatController.handleChat.bind(chatController));
app.post('/api/chat/clear', chatLimiter, chatController.clearHistory.bind(chatController));
app.get('/api/chat/history', chatLimiter, chatController.getHistory.bind(chatController));

// Cleanup old conversations periodically
setInterval(() => {
  conversationService.cleanupOldConversations();
}, 24 * 60 * 60 * 1000); // Run every 24 hours

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
}); 