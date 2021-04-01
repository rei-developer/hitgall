const Router = require('koa-router')
const multer = require('koa-multer')
const {v5: uuidv5} = require('uuid')
const Controller = require('./controller')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './img')
  },
  filename: (req, file, cb) => {
    const MY_NAMESPACE = '7d849d8b-7294-46ab-87a0-8851fb3c9256'
    const ext = file
      .originalname
      .substr(file.originalname.lastIndexOf('.'), file.originalname.length)
      .toLowerCase()
    const filename = uuidv5(`${Date.now()}-${file.originalname}`, MY_NAMESPACE)
    cb(null, `${filename}${ext}`)
  }
})
const upload = multer({
  storage,
  limits: {
    fileSize: 21504000
  }
})

const app = new Router()

app.post('/voice', Controller.createVoice)
app.post('/topic', upload.single('image'), Controller.createImage('topic'))
app.post('/background', upload.single('image'), Controller.createImage('background'))

module.exports = app
