const Router = require('koa-router')
const Controller = require('./controller')
const RateLimit = require('koa2-ratelimit').RateLimit

const {isAuthenticated} = require('../../lib/user')

const getUserChatLimiter = RateLimit.middleware({
  interval: {min: 1},
  max: 30,
  message: 'TOO_MANY_REQUEST'
})

const app = new Router()

app.post('/', isAuthenticated, getUserChatLimiter, Controller.sendMessage)

module.exports = app
