const { Storage } = require('@google-cloud/storage')

const dotenv = require('dotenv')

dotenv.config()

const { BUCKET_NAME } = process.env
const storage = new Storage({ keyFilename: 'key.json' })

const uploadFile = async filename => {
    await storage.bucket(BUCKET_NAME).upload(filename, {
        gzip: true,
        destination: filename,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    })
    console.log(`${filename} uploaded to ${BUCKET_NAME}.`)
}

const fs = require('fs')
const sharp = require('sharp')

module.exports.createImage = type => async ctx => {
    const checker = /(.gif|.png|.jpg|.jpeg|.webp)/i.test(ctx.req.file.originalname)
    const checkerByGIF = /.gif/i.test(ctx.req.file.originalname)
    const filename = ctx.req.file.filename
    // ex).webp.mp4 형식 수정
    try {
        if (checker) {
            fs.readFile(`img/${filename}`, async (err, data) => {
                if (err)
                    return ctx.body = {
                        message: err,
                        status: 'fail'
                    }
                await uploadFile(`img/${filename}`)
                if (type === 'topic') {
                    const thumbnail = sharp(data)
                    thumbnail
                        .metadata()
                        .then(() => thumbnail.resize(100, 100).withMetadata().rotate().toBuffer())
                        .then(result => fs.writeFile(`img/thumb/${filename}`, result, async () => {
                            await uploadFile(`img/thumb/${filename}`)
                        }))
                }
                if (type === 'background') {
                    const thumbnail = sharp(data)
                    thumbnail
                        .metadata()
                        .then(() => thumbnail.resize(120, 100).withMetadata().rotate().toBuffer())
                        .then(result => fs.writeFile(`img/thumb/${filename}`, result, async () => {
                            await uploadFile(`img/thumb/${filename}`)
                        }))
                }
            })
            ctx.body = {
                filename,
                status: 'ok'
            }
        } else {
            fs.unlink(`img/${filename}`, () => console.log(`삭제 : img/${filename}`))
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