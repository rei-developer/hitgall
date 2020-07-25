const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/admin/list', Controller.getAdminBoards)
app.get('/admin/:domain', Controller.getAdminBoardInfo)
app.patch('/admin/:domain/edit', Controller.updateAdminBoardInfo)

module.exports = app