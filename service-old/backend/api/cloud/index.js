const Router = require('koa-router')
const multer = require('koa-multer')
const uuidv5 = require('uuid/v5')
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
        fileSize: 10485760
    }
})

const app = new Router()

app.post('/profile', upload.single('img'), Controller.createImage())
app.post(
    '/background',
    upload.single('img'),
    Controller.createImage('background')
)
app.post('/icon', upload.single('img'), Controller.createImage('icon'))
app.post('/pick', upload.single('img'), Controller.createImage('pick'))
app.post('/topic', upload.single('img'), Controller.createImage('topic'))

module.exports = app
