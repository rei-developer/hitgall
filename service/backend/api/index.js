const Router = require('koa-router')
const auth = require('./auth')
const poll = require('./poll')
const cloud = require('./cloud')
const icon = require('./icon')
const notice = require('./notice')
const pick = require('./pick')
const sticker = require('./sticker')
const topic = require('./topic')
const save = require('./save')

const VERSION = 340

const app = new Router()

app.get('/version', ctx => ctx.body = {
    version: VERSION,
    status: 'ok'
})
app.use('/auth', auth.routes())
app.use('/poll', poll.routes())
app.use('/cloud', cloud.routes())
app.use('/icon', icon.routes())
app.use('/notice', notice.routes())
app.use('/pick', pick.routes())
app.use('/sticker', sticker.routes())
app.use('/topic', topic.routes())
app.use('/save', save.routes())

module.exports = app