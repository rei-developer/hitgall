const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/admin/list', Controller.getAdminBoards)
app.get('/admin/:domain/blind/list', Controller.getAdminBoardBlinds)
app.get('/admin/:domain/remove/list', Controller.getAdminBoardRemoveLogs)
app.get('/admin/:domain', Controller.getAdminBoardInfo)
app.get('/:domain', Controller.getBoardInfo)
app.post('/admin/:domain/blind/add', Controller.createAdminBoardBlind)
app.patch('/admin/:domain/edit', Controller.updateAdminBoardInfo)
app.delete('/admin/:domain/blind/remove', Controller.deleteAdminBoardBlind)

module.exports = app