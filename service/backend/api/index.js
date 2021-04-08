const request = require('request').defaults({encoding: null})
const client = require('nekos.life')
const Router = require('koa-router')

const auth = require('./auth')
const board = require('./board')
const poll = require('./poll')
const cloud = require('./cloud')
const icon = require('./icon')
const notice = require('./notice')
const pick = require('./pick')
const sticker = require('./sticker')
const topic = require('./topic')
const save = require('./save')

const VERSION = 400

const app = new Router()
const {nsfw} = new client()

app.get('/version', ctx => ctx.body = {
  version: VERSION,
  status: 'ok'
})
app.get('/random', async ctx => {
  try {
    const {url} = await nsfw.ero()
    const result = await new Promise((resolve, reject) => {
      request.get(url, (error, response, body) => {
        if (error || response.statusCode !== 200)
          return reject({message: error || 'unknown error', status: 'fail'})
        const content = `data:${response.headers['content-type']};base64,${Buffer.from(body).toString('base64')}`
        resolve({url, content, status: 'ok'})
      })
    })
    return ctx.body = result
  } catch (e) {
    return ctx.body = e
  }
})
app.use('/auth', auth.routes())
app.use('/board', board.routes())
app.use('/poll', poll.routes())
app.use('/cloud', cloud.routes())
app.use('/icon', icon.routes())
app.use('/notice', notice.routes())
app.use('/pick', pick.routes())
app.use('/sticker', sticker.routes())
app.use('/topic', topic.routes())
app.use('/save', save.routes())

module.exports = app
