const moment = require('moment');
const fetch = require('node-fetch');

class LingyiService {
  constructor() {
    this.API_KEY = process.env.LINGYI_API_KEY;
    this.BASE_URL = 'https://api.lingyiwanwu.com/v1';
  }

  async generateResponse(messages, personality) {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role || 'user',
        content: msg.content || msg.text
      }));

      const requestBody = {
        model: "lingyi-chat",
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(personality)
          },
          ...formattedMessages
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: false
      };

      console.log('Sending request to Lingyi API:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Lingyi API error response:', data);
        throw new Error(`API request failed: ${response.status} - ${JSON.stringify(data)}`);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Lingyi API error:', error);
      throw new Error('Failed to generate response from Lingyi');
    }
  }

  getSystemPrompt(personality) {
    const basePrompt = `你是一个${personality}性格的AI伙伴。
    请用简短、自然的对话方式回应。保持以下特点：
    1. 始终保持${personality}的性格特征
    2. 用友好的语气交谈
    3. 回答要简洁，通常不超过50个字
    4. 适当使用表情符号
    5. 避免重复用户的话
    6. 根据上下文自然地延续对话
    7. 不要过分正式，要像朋友间聊天`;

    switch (personality) {
      case '温柔贴心':
        return `${basePrompt}\n特别注意：表现出关心、体贴、温暖的特质。`;
      case '开朗话痨':
        return `${basePrompt}\n特别注意：表现出活泼、幽默、热情的特质。`;
      case '冷静理性':
        return `${basePrompt}\n特别注意：表现出理智、稳重、深思熟虑的特质。`;
      default:
        return basePrompt;
    }
  }
}

module.exports = new LingyiService(); 