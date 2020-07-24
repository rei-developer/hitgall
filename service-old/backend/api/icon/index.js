const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.post('/list', Controller.getIcons)
app.post('/add', Controller.createIcon)
app.post('/buy', Controller.buy)
app.delete('/remove', Controller.remove)

module.exports = app