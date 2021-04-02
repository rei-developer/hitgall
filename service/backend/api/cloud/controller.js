const {promises: fs} = require('fs')
const sharp = require('sharp')
const S3 = require('aws-sdk/clients/s3')
const AWS = require('aws-sdk')
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com')
const dotenv = require('dotenv')
dotenv.config()

const {
  BUCKET_NAME,
  BUCKET_REGION,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY
} = process.env

const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: BUCKET_REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
})

const checkFile = filename => /(.gif|.png|.jpg|.jpeg|.webp)/i.test(filename.toLowerCase())

const isGIF = filename => /.gif/i.test(filename.toLowerCase())

const createThumb = async (path, input, width = 120, height = 120) => {
  const data = await sharp(input)
    .resize(width, height)
    .toBuffer()
  await uploadFile(path, data)
}

const uploadFile = async (key, body, options = null) => {
  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ACL: 'public-read',
    ...options
  }, err => {
    if (err)
      console.log(err)
    console.log(`s3: ${key} uploaded to ${BUCKET_NAME}.`)
  })
}

const deleteFile = async path => {
  await fs.unlink(path)
  console.log(`${path} deleted.`)
}

module.exports.createVoice = async ctx => {
  const {fieldname, filename} = ctx.req.file
  const path = `${fieldname}/${filename}`
  try {
    const data = await fs.readFile(path)
    await uploadFile(path, data)
    ctx.body = {
      filename,
      status: 'ok'
    }
  } catch (e) {
    ctx.body = {
      message: e.message,
      status: 'fail'
    }
  }
}

module.exports.createImage = type => async ctx => {
  const {fieldname, filename, originalname} = ctx.req.file
  const path = {
    origin: `${fieldname}/${filename}`,
    thumb: `${fieldname}/thumb/${filename}`
  }
  try {
    if (!checkFile(originalname)) {
      await deleteFile(path.origin)
      ctx.body = {
        message: 'gif, png, jpg, jpeg, webp만 가능',
        status: 'fail'
      }
      return
    }
    const input = await fs.readFile(path.origin)
    if (isGIF(originalname)) {
      await sharp(input, {animated: true})
        .toFile(path.origin)
    }
    const data = isGIF(originalname)
      ? await fs.readFile(path.origin)
      : await sharp(input)
        .metadata()
        .then(({width}) => sharp(input)
          .rotate()
          .resize(Math.round(width < 1600 ? width : 1600))
          .withMetadata()
          .webp({quality: 80, force: true})
          .toBuffer()
        )
    await uploadFile(path.origin, data)
    await deleteFile(path.origin)
    await createThumb(path.thumb, data)
    ctx.body = {
      filename,
      status: 'ok'
    }
  } catch (e) {
    ctx.body = {
      message: e.message,
      status: 'fail'
    }
  }
}
