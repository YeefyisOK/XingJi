import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { ChatService } from '../../services/chatService'
import './index.scss'

export default function Message() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [chatService, setChatService] = useState(null)
  const scrollViewRef = useRef(null)

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
      storedUserInfo.personality,
      storedUserInfo.nickname,
      storedUserInfo.callMe
    )
    setChatService(service)

    // Initialize chat with greeting
    setMessages([
      {
        text: `你好，我是${storedUserInfo.nickname}，初次见面，很高兴认识你！`,
        isBot: true
      }
    ])
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

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

  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='message-container'>
      <View className='header'>
        <View className='header-left'>
          <View className='return-btn' onClick={handleBack}>
            <Text className='return-icon'>←</Text>
          </View>
          <Text className='friend-name'>{userInfo?.nickname || '小宇'}</Text>
        </View>
      </View>

      <ScrollView
        className='message-list'
        scrollY
        scrollWithAnimation
        enableFlex
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`message-item ${msg.isBot ? 'bot' : 'user'}`}
          >
            {msg.isBot && (
              <View className='avatar'>
                <View className='bot-avatar'>
                  <View className='bot-eyes'>
                    <View className='eye'></View>
                    <View className='eye'></View>
                  </View>
                </View>
              </View>
            )}
            <View className='message-content'>
              <Text className='message-text'>{msg.text}</Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View className='message-item bot'>
            <View className='avatar'>
              <View className='bot-avatar'>
                <View className='bot-eyes'>
                  <View className='eye'></View>
                  <View className='eye'></View>
                </View>
              </View>
            </View>
            <View className='message-content'>
              <Text className='message-text typing'>正在输入...</Text>
            </View>
          </View>
        )}
        <View ref={scrollViewRef} />
      </ScrollView>

      <View className='input-container'>
        <Input
          className='message-input'
          value={inputValue}
          onInput={e => setInputValue(e.detail.value)}
          placeholder='发送消息...'
          confirmType='send'
          onConfirm={handleSend}
          disabled={isLoading}
        />
        <View className='input-actions'>
          <View
            className={`send-btn ${isLoading ? 'disabled' : ''}`}
            onClick={handleSend}
          >
            发送
          </View>
        </View>
      </View>
    </View>
  )
} 