import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Login() {
  const [step, setStep] = useState(0)
  const [personality, setPersonality] = useState('')
  const [nickname, setNickname] = useState('')
  const [callMe, setCallMe] = useState('')

  const handlePersonalitySelect = (selected) => {
    setPersonality(selected)
    setStep(1)
  }

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setStep(2)
    }
  }

  const handleCallMeSubmit = () => {
    if (callMe.trim()) {
      // Save user info to storage
      Taro.setStorageSync('userInfo', {
        personality,
        nickname,
        callMe
      })
      
      // Navigate to main chat page
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <View className='login-container'>
      {step > 0 && (
        <View className='return-btn' onClick={handleBack}>
          <Text className='return-icon'>←</Text>
        </View>
      )}

      <View className='logo'>
        <View className='logo-circle'>
          <View className='logo-house'></View>
        </View>
      </View>

      <View className='step-container'>
        {step === 0 && (
          <>
            <Text className='title'>你希望我的性格是：</Text>
            <View className='options-list'>
              <View 
                className='option-item'
                onClick={() => handlePersonalitySelect('温柔贴心')}
              >
                A. 温柔贴心
              </View>
              <View 
                className='option-item'
                onClick={() => handlePersonalitySelect('开朗话痨')}
              >
                B. 开朗话痨
              </View>
              <View 
                className='option-item'
                onClick={() => handlePersonalitySelect('冷静理性')}
              >
                C. 冷静理性
              </View>
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text className='title'>为我取个名字吧：</Text>
            <View className='input-container'>
              <Input
                className='input-field'
                value={nickname}
                onInput={e => setNickname(e.detail.value)}
                onConfirm={handleNicknameSubmit}
                placeholder='请输入名字'
                confirmType='next'
              />
              <View className='send-btn' onClick={handleNicknameSubmit}>
                下一步
              </View>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text className='title'>你想让我叫你：</Text>
            <View className='input-container'>
              <Input
                className='input-field'
                value={callMe}
                onInput={e => setCallMe(e.detail.value)}
                onConfirm={handleCallMeSubmit}
                placeholder='请输入称呼'
                confirmType='done'
              />
              <View className='send-btn' onClick={handleCallMeSubmit}>
                完成
              </View>
            </View>
          </>
        )}
      </View>

      <Text className='welcome-text'>
        欢迎来到宇伴，快来认养你平行时空的小伙伴......
      </Text>
    </View>
  )
} 