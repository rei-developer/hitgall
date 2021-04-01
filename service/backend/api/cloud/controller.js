const S3 = require('aws-sdk/clients/s3')
const AWS = require('aws-sdk')
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com')
const {v5} = require('uuid')

const dotenv = require('dotenv')

dotenv.config()

const {
  BUCKET_NAME,
  MY_NAMESPACE,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY
} = process.env

const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: 'us-west-1',
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
    console.log(`s3 : ${key} uploaded to ${BUCKET_NAME}.`)
  })
}

const fs = require('fs')
const sharp = require('sharp')
const Lame = require('node-lame').Lame

module.exports.createVoice = async ctx => {
  let {blob} = ctx.request.body
  blob = blob.replace(/data:application\/octet-stream;/gim, 'data:audio/mpeg;')
  const decoder = new Lame({
    output: 'buffer'
    // bitrate: 192,
  }).setBuffer(Buffer.from(blob, 'base64'))
  try {
    const buffer = await new Promise((resolve, reject) => {
      decoder.decode()
        .then(() => resolve(decoder.getBuffer()))
        .catch(err => reject(err))
    })
    const tempName = v5(`${Date.now()}`, MY_NAMESPACE)
    await uploadFile(`voice/test-${tempName}.mpeg`, buffer, {
      ContentEncoding: 'base64',
      ContentType: 'audio/mpeg'
    })
    ctx.body = {
      status: 'ok'
    }
  } catch (e) {
    console.log(e)
    return ctx.body = e
  }
}

module.exports.createImage = type => async ctx => {
  const checker = /(.gif|.png|.jpg|.jpeg|.webp)/i.test(ctx.req.file.originalname)
  const checkerByGIF = /.gif/i.test(ctx.req.file.originalname)
  const filename = ctx.req.file.filename
  // ex).webp.mp4 형식 수정
  try {
    if (checker) {
      fs.readFile(`
    img /${filename}`, async (err, data) => {
        if (err)
          return ctx.body = {
            message: err,
            status: 'fail'
          }
        await uploadFile(`
    img /${filename}`, data)
        if (type === 'topic') {
          const thumbnail = sharp(data)
          thumbnail
            .metadata()
            .then(() => thumbnail.resize(100, 100).withMetadata().rotate().toBuffer())
            .then(result => fs.writeFile(`
    img / thumb /${filename}`, result, async () => {
              await uploadFile(`
    img / thumb /${filename}`, result)
            }))
        }
        if (type === 'background') {
          const thumbnail = sharp(data)
          thumbnail
            .metadata()
            .then(() => thumbnail.resize(120, 100).withMetadata().rotate().toBuffer())
            .then(result => fs.writeFile(`
    img / thumb /${filename}`, result, async () => {
              await uploadFile(`
    img / thumb /${filename}`, result)
            }))
        }
      })
      ctx.body = {
        filename,
        status: 'ok'
      }
    } else {
      fs.unlink(`
    img /${filename}`, () => console.log(`
    삭제 : img /${filename}`))
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
