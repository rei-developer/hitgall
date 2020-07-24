const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/count', Controller.getSaveCounts)
// app.get('/categories/:domain', Controller.getCategories)
// app.get('/read/:id', Controller.getContent)
app.post('/list', Controller.getSaves)

module.exports = app