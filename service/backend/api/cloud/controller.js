const fs = require('fs')
const sharp = require('sharp')
const { execFile } = require('child_process')
const giflossy = require('giflossy')

module.exports.createImage = type => async ctx => {
    const checker = /(.gif|.png|.jpg|.jpeg|.webp)/i.test(ctx.req.file.originalname)
    const checkerByGIF = /.gif/i.test(ctx.req.file.originalname)
    const filename = ctx.req.file.filename
    // ex).webp.mp4 형식 수정
    try {
        if (checker) {
            fs.readFile(`./img/${filename}`, (err, data) => {
                if (err)
                    return ctx.body = {
                        message: err,
                        status: 'fail'
                    }
                if (checkerByGIF) {
                    execFile(giflossy, [
                        '-O3', '--lossy=80', '-o', `./img/${filename}`, `./img/${filename}`
                    ], err => {
                        if (err)
                            return ctx.body = {
                                message: err,
                                status: 'fail'
                            }
                        if (type === 'icon')
                            fs.writeFile(
                                `./icon/${filename}`,
                                data,
                                () => fs.unlink(`./img/${filename}`, () => { })
                            )
                    })
                } else {
                    const image = sharp(data)
                    if (type === 'topic') {
                        image
                            .metadata()
                            .then(
                                metadata => image.resize(Math.min(metadata.width, 960)).withMetadata().rotate().jpeg(80).toBuffer()
                            )
                            .then(result => fs.writeFile(`./img/${filename}`, result, () => { }))
                    } else if (type === 'background') {
                        image
                            .metadata()
                            .then(
                                metadata => image.resize(Math.min(metadata.width, 960)).jpeg(80).toBuffer()
                            )
                            .then(
                                result => fs.writeFile(`./background/${filename}`, result, () => fs.unlink(`./img/${filename}`, () => { }))
                            )
                    } else if (type === 'icon') {
                        image
                            .metadata()
                            .then(() => image.resize(23, 23).toBuffer())
                            .then(
                                result => fs.writeFile(`./icon/${filename}`, result, () => fs.unlink(`./img/${filename}`, () => { }))
                            )
                    } else if (type === 'pick') {
                        image
                            .metadata()
                            .then(
                                metadata => image.resize(Math.min(metadata.width, 960)).withMetadata().rotate().jpeg(80).toBuffer()
                            )
                            .then(
                                result => fs.writeFile(`./pick/${filename}`, result, () => fs.unlink(`./img/${filename}`, () => { }))
                            )
                    } else {
                        image
                            .metadata()
                            .then(() => image.resize(100, 100).withMetadata().rotate().toBuffer())
                            .then(
                                result => fs.writeFile(`./profile/${filename}`, result, () => fs.unlink(`./img/${filename}`, () => { }))
                            )
                    }
                }
                if (type === 'topic') {
                    const thumbnail = sharp(data)
                    thumbnail
                        .metadata()
                        .then(() => thumbnail.resize(100, 100).withMetadata().rotate().toBuffer())
                        .then(result => fs.writeFile(`./img/thumb/${filename}`, result, () => { }))
                } else if (type === 'pick') {
                    const thumbnail = sharp(data)
                    thumbnail
                        .metadata()
                        .then(() => thumbnail.resize(80, 80).withMetadata().rotate().toBuffer())
                        .then(result => fs.writeFile(`./pick/thumb/${filename}`, result, () => { }))
                }
            })
            ctx.body = {
                filename,
                status: 'ok'
            }
        } else {
            fs.unlink(`./img/${filename}`, () => { })
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