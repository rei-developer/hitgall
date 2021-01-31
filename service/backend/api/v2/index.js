const Router = require('koa-router')

const novel = require('./novel')

const app = new Router()

app.use('/novel', novel.routes())

module.exports = app
