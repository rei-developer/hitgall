const Router = require("koa-router")
const multer = require("koa-multer")
const uuidv5 = require("uuid/v5")
const Controller = require("./controller")
const gcsSharp = require("multer-sharp")
const dotenv = require("dotenv")

dotenv.config()

const { BUCKET_NAME } = process.env

const storage = gcsSharp({
	filename: (_, file, cb) => {
		const MY_NAMESPACE = "7d849d8b-7294-46ab-87a0-8851fb3c9256"
		const ext = file.originalname
			.substr(file.originalname.lastIndexOf("."), file.originalname.length)
			.toLowerCase()
		const filename = uuidv5(`${Date.now()}-${file.originalname}`, MY_NAMESPACE)
		console.log(`${filename} uploaded to ${BUCKET_NAME}.`)
		cb(null, `${filename}${ext}`)
	},
	bucket: BUCKET_NAME,
	keyFilename: "key.json",
	// destination: filename,
	acl: "publicRead",
	gzip: true,
	sizes: [
		{ suffix: "xlg", width: 1200 },
		// { suffix: "lg", width: 800 },
		// { suffix: "md", width: 500 },
		// { suffix: "sm", width: 300 },
		{ suffix: "xs", width: 100, height: 100 }
	],
	metadata: {
		cacheControl: "public, max-age=31536000"
	}
})

const upload = multer({
	storage,
	limits: {
		fileSize: 10485760
	}
})

const app = new Router()

app.post("/background", upload.single("image"), Controller.createImage("background"))
app.post("/topic", upload.single("image"), Controller.createImage("topic"))

module.exports = app