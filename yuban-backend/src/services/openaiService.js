const OpenAI = require('openai');
const moment = require('moment');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class OpenAIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured in .env file');
    }

    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  async generateResponse(messages, personality) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(personality)
          },
          ...messages
        ],
        max_tokens: 150,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate response');
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

module.exports = new OpenAIService(); 