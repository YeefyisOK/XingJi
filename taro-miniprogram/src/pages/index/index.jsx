import { View, Text, Image, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { ChatService } from '../../services/chatService'
import './index.scss'

export default function Index() {
  const [userInfo, setUserInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [chatService, setChatService] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUserInfo = Taro.getStorageSync('userInfo')
    if (!storedUserInfo) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
      return
    }

    setUserInfo(storedUserInfo)
    const service = new ChatService(
      Taro.getStorageSync('userId') || Date.now().toString(),
      storedUserInfo.personality
    )
    setChatService(service)

    // Initialize chat with greeting
    const initialMessages = [
      {
        text: `你好，我是${storedUserInfo.nickname}，初次见面，很高兴认识你！`,
        isBot: true
      }
    ]
    setMessages(initialMessages)
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, isBot: false }])
    
    setIsLoading(true)
    try {
      // Get bot response
      const reply = await chatService.sendMessage(userMessage)
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: reply, isBot: true }])
    } catch (error) {
      Taro.showToast({
        title: '发送消息失败',
        icon: 'none'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturn = () => {
    Taro.navigateBack()
  }

  return (
    <View className='chat-container'>
      <View className='header'>
        <View className='header-left'>
          <View className='return-btn' onClick={handleReturn}>
            <Text className='return-icon'>←</Text>
          </View>
          <Text className='friend-name'>{userInfo?.nickname || '小宇'}</Text>
        </View>
        <View className='intimacy'>
          <Text className='intimacy-text'>亲密度：10/100</Text>
        </View>
      </View>

      <View className='chat-content'>
        <View className='character-container'>
          <View className='character'>
            <View className='character-eyes'>
              <View className='eye'></View>
              <View className='eye'></View>
            </View>
          </View>
        </View>

        <View className='messages-container'>
          {messages.map((msg, index) => (
            <View key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
              <Text className='message-text'>{msg.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='input-container'>
        <Input
          className='message-input'
          value={inputValue}
          onInput={e => setInputValue(e.detail.value)}
          placeholder='Send message...'
          confirmType='send'
          onConfirm={handleSend}
        />
        <View className='input-actions'>
          <View className='action-btn voice'></View>
          <View className='action-btn send' onClick={handleSend}>发送</View>
        </View>
      </View>
    </View>
  )
}
