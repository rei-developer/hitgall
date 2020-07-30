const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/view/:id', Controller.getInventoryItemView)
app.get('/list/:id', Controller.getInventoryItem)
app.get('/list', Controller.getInventory)
app.post('/list', Controller.getStickers)
app.post('/buy', Controller.createInventoryItem)

module.exports = app