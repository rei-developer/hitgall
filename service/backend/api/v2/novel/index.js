const Router = require('koa-router')
const {authenticated} = require('./middleware')
const {
  getNovelScript,
  getNovelList,
  getNovel
} = require('./controller')

const app = new Router()

app.post('/script/:idx/:version', authenticated, getNovelScript)
app.post('/', getNovelList)
app.post('/:idx/:version', authenticated, getNovel)

module.exports = app
