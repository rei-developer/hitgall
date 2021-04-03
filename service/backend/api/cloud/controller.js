const fs = require('fs')
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

const isImageFile = filename => ['gif', 'png', 'jpg', 'jpeg', 'webp'].some(item => filename.toLowerCase().endsWith(item))
const isGIF = filename => filename.toLowerCase().endsWith('gif')

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
  await fs.unlinkSync(path)
  console.log(`${path} deleted.`)
}

module.exports.createVoice = async ctx => {
  const {fieldname: field, filename} = ctx.req.file
  const path = `${field}/${filename}`
  try {
    const data = await fs.readFileSync(path)
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
  const {fieldname: field, filename, originalname: origin} = ctx.req.file
  const path = {
    origin: `${field}/${filename}`,
    thumb: `${field}/thumb/${filename}`
  }
  try {
    if (!isImageFile(origin)) {
      await deleteFile(path.origin)
      ctx.body = {
        message: 'gif, png, jpg, jpeg, webp만 가능',
        status: 'fail'
      }
      return
    }
    const input = await fs.readFileSync(path.origin)
    if (isGIF(origin)) {
      await sharp(input, {animated: true})
        .toFile(path.origin)
    }
    const data = isGIF(origin)
      ? await fs.readFileSync(path.origin)
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
