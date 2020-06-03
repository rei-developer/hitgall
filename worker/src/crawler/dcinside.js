const { Storage } = require('@google-cloud/storage')
const { v5 } = require('uuid')
// const { execFile } = require('child_process')
const fs = require('fs')
const sharp = require('sharp')
// const giflossy = require('giflossy')
const moment = require('moment')
const dotenv = require('dotenv')
const request = require('request')
const header = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'gall.dcinside.com',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
}
const createTopic = require('../database/topic/create')
const readTopic = require('../database/topic/read')

dotenv.config()

const { BUCKET_NAME, MY_NAMESPACE } = process.env

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

const getTopics = async url => {
    console.log(url, 'get topics...')
    try {
        const result = await new Promise((resolve, reject) => {
            request.get(url, header, (err, response, body) => {
                if (err || response.statusCode !== 200 || body === '')
                    return reject(err || 'get topics failed...')
                const regex = /<tr class="ub-content us-post" data-no="([\s\S]*?)" data-type="([\s\S]*?)">([\s\S]*?)<\/tr>/gim
                let items = []
                let xArray
                while (xArray = regex.exec(body)) {
                    const no = xArray[1]
                    items.push(no)
                }
                resolve(items)
            })
        })
        return result
    } catch (err) {
        console.log(err)
        return false
    }
}

const getContent = async url => {
    console.log(url, 'get content...')
    try {
        let regex, data
        const result = await new Promise((resolve, reject) => {
            request.get(url, header, (err, response, body) => {
                if (err || response.statusCode !== 200 || body === '')
                    return reject(err || 'get content failed...')
                // get author
                regex = /<span class='nickname in' title='([\s\S]*?)'([\s\S]*?)>([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject('get author failed...')
                const author = data[0].replace(regex, '$1').trim()
                // get created
                regex = /<span class="gall_date" title="([\s\S]*?)">([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject('get created failed...')
                const created = data[0].replace(regex, '$1').trim()
                // get title
                regex = /<span class="title_subject">([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject('get title failed...')
                const title = data[0].replace(regex, '$1').trim()
                // get content
                regex = /<div class="inner clear">([\s\S]*?)<!--/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject('get topic content failed...')
                let content = data[0].replace(regex, '$1').trim()
                // get image url
                let images = []
                if (data.length > 0) {
                    regex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/gim
                    let xArray
                    while (xArray = regex.exec(content)) {
                        const imageUrl = xArray[1]
                        const uuid = v5(`${Date.now()}-${imageUrl}`, MY_NAMESPACE)
                        images.push({
                            origin: imageUrl,
                            url: imageUrl.replace(/\:\/\/([^\/?#]+)/, '://images.dcinside.com'),
                            uuid
                        })
                    }
                    if (images.length > 0)
                        images.map(item => content = content.replace(item.origin, `/img/${item.uuid}.gif`))
                }
                resolve({
                    author,
                    title,
                    content,
                    created: moment(created).format(),
                    images
                })
            })
        })
        return result
    } catch (err) {
        console.log(err)
        return false
    }
}

const download = async (item, no) => {
    console.log(item.url, no, 'downloading...')
    try {
        await new Promise((resolve, reject) => {
            request.defaults({ encoding: null }).get(item.url, header, (err, response, body) => {
                if (err || response.statusCode !== 200)
                    return reject(err || `${no}: ${item.url} download failed...`)
                const path = `img/${item.uuid}.gif`
                const pathThumb = `img/thumb/${item.uuid}.gif`
                const content = Buffer.from(body, 'base64')
                fs.writeFile(path, content, () => {
                    // execFile(giflossy, ['-O3', '--lossy=80', '-o', path, path], err => {
                    //     if (err)
                    //         return reject(err)
                    const thumbnail = sharp(content)
                    thumbnail.metadata()
                        .then(() => thumbnail.resize(80, 80).toBuffer())
                        .then(result => fs.writeFile(pathThumb, result, async () => {
                            await uploadFile(path)
                            await uploadFile(pathThumb)
                            resolve()
                        }))
                    // })
                })
            })
        })
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

const save = async (options, no) => {
    console.log(no, 'saving...')
    try {
        const url = `https://gall.dcinside.com/board/view/?id=${options.label}&no=${no}`
        const data = await getContent(url)
        if (!data)
            return false
        if (data.images.length > 0) {
            const jobs = data.images.map(item => new Promise(async (resolve, reject) => {
                const success = await download(item, no)
                if (!success)
                    return reject(`${no}: ${item.url} download failed...`)
                resolve()
            }))
            await Promise.all(jobs)
        }
        const topicId = await createTopic({
            no,
            type: options.type,
            label: options.label,
            author: data.author,
            title: data.title,
            content: data.content,
            originUrl: url,
            thumbImageUUID: data.images.length > 0 ? `${data.images[0].uuid}.gif` : '',
            created: data.created
        })
        if (!topicId)
            return false
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

const work = async options => {
    try {
        const url = `https://gall.dcinside.com/board/lists/?id=${options.label}&page=${++options.page}`
        const no = await readTopic.getNo() || 0
        const topics = await getTopics(url)
        if (!topics || topics.length < 1)
            return console.log(url, 'failed...')
        const jobs = topics.map(item => new Promise(async (resolve, reject) => {
            if (no == item)
                return reject('this is same topic.')
            const success = await save(options, item)
            if (!success)
                return reject('save failed...')
            resolve()
        }))
        const result = await Promise.all(jobs)
        if (!result)
            console.log(url, 'failed...')
        if (options.page <= options.maxPage)
            setTimeout(async () => await work(options), options.delay || 10000)
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

module.exports = async options => await work(options)