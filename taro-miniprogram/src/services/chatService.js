import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:3000/api'

export class ChatService {
  constructor(userId, personality, botName, userName) {
    if (!userId || !personality || !botName || !userName) {
      console.error('Missing required parameters:', { userId, personality, botName, userName });
    }
    
    this.userId = userId;
    this.personality = personality;
    this.botName = botName;
    this.userName = userName;
  }

  async sendMessage(message) {
    try {
      const requestData = {
        message,
        userId: this.userId,
        personality: this.personality,
        botName: this.botName,
        userName: this.userName
      };

      console.log('Sending request with data:', requestData);

      const response = await Taro.request({
        url: `${BASE_URL}/chat`,
        method: 'POST',
        data: requestData,
        header: {
          'content-type': 'application/json'
        }
      });

      console.log('Response:', response);

      if (response.statusCode !== 200) {
        console.error('API Error Response:', response.data);
        throw new Error(`API request failed: ${response.statusCode}`);
      }

      return response.data.reply;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async clearHistory() {
    try {
      await Taro.request({
        url: `${BASE_URL}/chat/clear`,
        method: 'POST',
        data: {
          userId: this.userId
        }
      })
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }
} 