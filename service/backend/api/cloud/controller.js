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

const makeThumbnail = (width, height, filename, data) => {
  const thumbnail = sharp(data)
  thumbnail
    .metadata()
    .then(() => thumbnail.resize(width, height).withMetadata().rotate().toBuffer())
    .then(result => fs.writeFile(`img/thumb/${filename}`, result, async () => {
      await uploadFile(`img/thumb/${filename}`, result)
      deleteFile(`img/thumb/${filename}`)
    }))
}

const deleteFile = path => fs.unlink(path, () => console.log(`${path} deleted.`))

module.exports.createVoice = async ctx => {
  const filename = ctx.req.file.filename
  try {
    fs.readFile(`voice/${filename}`, async (err, data) => {
      if (err)
        return ctx.body = {
          message: err,
          status: 'fail'
        }
      await uploadFile(`voice/${filename}`, data)
    })
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
  const checker = /(.gif|.png|.jpg|.jpeg|.webp)/i.test(ctx.req.file.originalname.toLowerCase())
  const filename = ctx.req.file.filename
  try {
    if (checker) {
      fs.readFile(`img/${filename}`, async (err, data) => {
        if (err)
          return ctx.body = {
            message: err,
            status: 'fail'
          }
        await uploadFile(`img/${filename}`, data)
        makeThumbnail(type === 'topic' ? 100 : 120, 100, filename, data)
        if (type === 'topic')
          deleteFile(`img/${filename}`)
      })
      ctx.body = {
        filename,
        status: 'ok'
      }
    } else {
      deleteFile(`img/${filename}`)
      ctx.body = {
        message: 'gif, png, jpg, jpeg, webp만 가능',
        status: 'fail'
      }
    }
  } catch (e) {
    ctx.body = {
      message: e.message,
      status: 'fail'
    }
  }
}
