const Router = require('koa-router')
const Controller = require('./controller')

const app = new Router()

app.get('/read/:id', Controller.getContent)
app.post('/list', Controller.getPicks)
app.post('/list/post', Controller.getPickPosts)
app.post('/write', Controller.createPick)
app.post('/write/post', Controller.createPickPost)
app.post('/vote', Controller.createPickVotes)
app.patch('/edit/post', Controller.updatePickPost)
app.delete('/delete/post', Controller.deletePickPost)

module.exports = app