import { View, Text, ScrollView, Input } from '@tarojs/components'
import { useState, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { ChatService } from '../../services/chatService'
import './ChatPage.scss'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [chatService, setChatService] = useState(null)
  const scrollViewRef = useRef(null)

  useEffect(() => {
    const storedUserInfo = Taro.getStorageSync('userInfo')
    console.log('Stored user info:', storedUserInfo)
    
    if (!storedUserInfo) {
      Taro.redirectTo({
        url: '/pages/login/LoginPage'
      })
      return
    }

    setUserInfo(storedUserInfo)
    const userId = Taro.getStorageSync('userId') || Date.now().toString()
    Taro.setStorageSync('userId', userId)

    // Ensure all required values are present
    const service = new ChatService(
      userId,
      storedUserInfo.personality,  // Remove default value to catch missing data
      storedUserInfo.nickname,     // Remove default value to catch missing data
      storedUserInfo.callMe        // Remove default value to catch missing data
    )
    
    console.log('Creating chat service with:', {
      userId,
      personality: storedUserInfo.personality,
      botName: storedUserInfo.nickname,
      userName: storedUserInfo.callMe
    })
    
    setChatService(service)

    // Initialize chat with greeting
    if (storedUserInfo.nickname && storedUserInfo.callMe) {
      setMessages([
        {
          text: `你好${storedUserInfo.callMe}，我是${storedUserInfo.nickname}，初次见面，很高兴认识你！`,
          isBot: true
        }
      ])
    }
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !chatService) {
      console.log('Send prevented:', { 
        hasInput: !!inputValue.trim(), 
        isLoading, 
        hasService: !!chatService 
      })
      return
    }

    const userMessage = inputValue.trim()
    setInputValue('')
    
    setMessages(prev => [...prev, { text: userMessage, isBot: false }])
    
    setIsLoading(true)
    try {
      console.log('Sending message:', userMessage)
      const reply = await chatService.sendMessage(userMessage)
      console.log('Received reply:', reply)
      
      setMessages(prev => [...prev, { text: reply, isBot: true }])
    } catch (error) {
      console.error('Send message error:', error)
      Taro.showToast({
        title: '发送消息失败',
        icon: 'none',
        duration: 2000
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of the component remains the same
} 