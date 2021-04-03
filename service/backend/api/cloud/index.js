const Router = require('koa-router')
const multer = require('koa-multer')
const {v5: UUID} = require('uuid')
const Controller = require('./controller')
const dotenv = require('dotenv')
dotenv.config()

const {
  MY_NAMESPACE,
  UPLOAD_MAX_SIZE_MB
} = process.env

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./${file.fieldname}`)
  },
  filename: (req, file, cb) => {
    const {originalname: origin} = file
    const pureExt = origin
      .substr(origin.lastIndexOf('.'), origin.length)
      .toLowerCase()
    const filename = UUID(`${Date.now()}-${origin}`, MY_NAMESPACE)
    const ext = pureExt === '.mpeg'
      ? '.mpeg'
      : '.webp'
    cb(null, `${filename}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: {fileSize: 1024 * 1000 * (UPLOAD_MAX_SIZE_MB + 1)}
})

const app = new Router()

app.post('/voice', upload.single('voice'), Controller.createVoice)
app.post('/topic', upload.single('img'), Controller.createImage('topic'))
app.post('/background', upload.single('img'), Controller.createImage('background'))

module.exports = app
