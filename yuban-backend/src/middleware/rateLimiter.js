const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: '请求太频繁，请稍后再试'
  }
});

module.exports = {
  chatLimiter
}; 