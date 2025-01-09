import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:3000/api'

export class ChatService {
  constructor(userId, personality) {
    this.userId = userId
    this.personality = personality
  }

  async sendMessage(message) {
    try {
      const response = await Taro.request({
        url: `${BASE_URL}/chat`,
        method: 'POST',
        data: {
          message,
          userId: this.userId,
          personality: this.personality
        },
        header: {
          'content-type': 'application/json'
        }
      })

      return response.data.reply
    } catch (error) {
      console.error('Failed to send message:', error)
      throw new Error('Failed to get response from chat service')
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