const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/', Controller.getCount)
app.post('/list', Controller.getNotices)
app.delete('/clear/:id', Controller.deleteNotice)
app.delete('/clear', Controller.deleteNotices)
app.put('/readed/:id/:flag', Controller.updateNoticeByConfirm)
app.put('/readed', Controller.updateNoticesByConfirm)

module.exports = app