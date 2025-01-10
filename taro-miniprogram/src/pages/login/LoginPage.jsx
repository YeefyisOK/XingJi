const handleCallMeSubmit = () => {
  if (callMe.trim() && nickname.trim() && personality) {
    const userInfo = {
      personality,
      nickname,
      callMe
    };
    
    console.log('Saving user info:', userInfo);
    Taro.setStorageSync('userInfo', userInfo);
    
    Taro.redirectTo({
      url: '/pages/message/ChatPage'
    });
  } else {
    Taro.showToast({
      title: '请填写完整信息',
      icon: 'none',
      duration: 2000
    });
  }
}; 