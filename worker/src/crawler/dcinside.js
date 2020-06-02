const fs = require('fs')
const sharp = require('sharp')
const { execFile } = require('child_process')
const giflossy = require('giflossy')
const moment = require('moment')
const uuidv5 = require('uuidv5')
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

const { MY_NAMESPACE } = process.env

const getList = async url => {
    try {
        const result = await new Promise((resolve, reject) => {
            request.get(url, header, (err, response, body) => {
                if (err || response.statusCode !== 200)
                    return reject({ message: err || 'non-content', status: 'fail' })
                let items = []
                const regex = /<tr class="ub-content us-post" data-no="([\s\S]*?)" data-type="([\s\S]*?)">([\s\S]*?)<\/tr>/gim
                let xArray
                while (xArray = regex.exec(body)) {
                    const no = xArray[1]
                    items.push(no)
                }
                resolve({ items, status: 'ok' })
            })
        })
        return result
    } catch (err) {
        console.log(err)
        return false
    }
}

const getContent = async (url, no) => {
    console.log(no, '시도중...')
    try {
        let regex, data
        const result = await new Promise((resolve, reject) => {
            request.get(url, header, (err, response, body) => {
                if (err || response.statusCode !== 200 || body === '')
                    return reject({ message: err || 'non-content', status: 'fail' })
                // get author
                regex = /<span class='nickname in' title='([\s\S]*?)'([\s\S]*?)>([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject({ message: 'non-author', status: 'fail' })
                const author = data[0].replace(regex, '$1').trim()
                // get created
                regex = /<span class="gall_date" title="([\s\S]*?)">([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject({ message: 'non-created', status: 'fail' })
                const created = data[0].replace(regex, '$1').trim()
                // get title
                regex = /<span class="title_subject">([\s\S]*?)<\/span>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject({ message: 'non-title', status: 'fail' })
                const title = data[0].replace(regex, '$1').trim()
                // get content
                regex = /<div style="overflow:hidden;">([\s\S]*?)<\/div>/gim
                data = body.match(regex)
                if (data.length < 1)
                    return reject({ message: 'non-content', status: 'fail' })
                let content = data[0].replace(regex, '$1').trim()
                // get image url
                let images = []
                if (data.length > 0) {
                    regex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/gim
                    let xArray
                    while (xArray = regex.exec(content)) {
                        const imageUrl = xArray[1]
                        const uuid = uuidv5(`${Date.now()}-${imageUrl}`, MY_NAMESPACE)
                        images.push({
                            origin: imageUrl,
                            url: imageUrl.replace(/\:\/\/([^\/?#]+)/, '://images.dcinside.com'),
                            uuid
                        })
                    }
                    if (images.length > 0)
                        images.map(item => content = content.replace(item.origin, `/img/${no}/${item.uuid}.gif`))
                }
                resolve({
                    type: 'DC',
                    author,
                    title,
                    content,
                    created: moment(created).format(),
                    images,
                    status: 'ok'
                })
            })
        })
        return result
    } catch (err) {
        console.log(err)
        return false
    }
}

const submit = async (url, no) => {
    try {
        const data = await getContent(url, no)
        if (!data)
            return console.log('failed')
        const topicId = await createTopic({
            no,
            type: data.type,
            author: data.author,
            title: data.title,
            content: data.content,
            originUrl: url,
            created: data.created
        })
        if (!topicId)
            return console.err('database failed')
        if (data.images.length > 0) {
            const jobs = data.images.map(item => new Promise(async (resolve, reject) => {
                const success = await download(item, no)
                if (!success)
                    return reject({ message: 'download failed', status: 'fail' })
                resolve(true)
            }))
            await Promise.all(jobs)
        }
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

const download = async (item, no) => {
    try {
        const result = await new Promise((resolve, reject) => {
            request.defaults({ encoding: null }).get(item.url, header, (err, response, body) => {
                if (err || response.statusCode !== 200)
                    return reject({ message: err || 'non-content', status: 'fail' })
                const path = `./img/${no}/${item.uuid}.gif`
                const content = Buffer.from(body, 'base64')
                fs.writeFile(path, content, () => {
                    execFile(giflossy, ['-O3', '--lossy=80', '-o', path, path], err => {
                        if (err)
                            return reject({ message: err, status: 'fail' })
                        const thumbnail = sharp(content)
                        thumbnail.metadata()
                            .then(() => thumbnail.resize(100, 100).toBuffer())
                            .then(result => fs.writeFile(`./img/thumb/${no}/${item.uuid}.gif`, result, () => resolve({ status: 'ok' })))
                    })
                })
            })
        })
        return result
    } catch (err) {
        console.log(err)
        return false
    }
}

let page = 0
const maxPage = 3

const work = async () => {
    const newestNo = await readTopic.getNewestNo() || 0
    const url = `https://gall.dcinside.com/board/lists/?id=hit&page=${++page}`
    const list = await getList(url)
    if (list.items.length > 0) {
        const jobs = list.items.map(item => new Promise(async resolve => {
            if (item != newestNo) {
                const success = await submit(`https://gall.dcinside.com/board/view/?id=hit&no=${item}`, item)
                if (!success)
                    return
            }
            if (page <= maxPage)
                setTimeout(async () => await work(), 5000)
        }))
        await Promise.all(jobs)
    }
    console.log(url, 'Finish...')
}

module.exports = async () => await work()