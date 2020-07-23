const { Storage } = require('@google-cloud/storage')
const { v5 } = require('uuid')
const fs = require('fs')
const fsExtra = require('fs-extra')
const sharp = require('sharp')
const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const dotenv = require('dotenv')
const createSave = require('../database/save/create')
const readSave = require('../database/save/read')

dotenv.config()

const { BUCKET_NAME, MY_NAMESPACE } = process.env
const storage = new Storage({ keyFilename: 'key.json' })
const header = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'theqoo.net',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
}

let options
let page = 1
let topics = []

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

const getHtml = async url => {
    try {
        return await axios.get(url, { header })
    } catch (error) {
        console.error(error)
    }
}

const getList = async () => {
    if (page > options.maxPage)
        return console.log(`Finish one's work... ${new Date().getDate()}`)
    const url = `https://theqoo.net/index.php?mid=${options.board}&page=${page++}${options.extendedLink || ''}`
    console.log(url)
    await getHtml(url)
        .then(html => {
            let ulList = []
            const $ = cheerio.load(html.data)
            const $bodyList = $('table.theqoo_board_table').children('tbody').find('tr:not(.notice):not(.notice_expand)')
            $bodyList.each(function (i, el) {
                const link = $(this).find('td.title').children('a').eq(0).attr('href')
                const match = link.match(/[0-9]+/gim)[1]
                ulList[i] = match
            })
            return ulList.filter(item => item)
        })
        .then(res => {
            topics = res
            getTopic()
        })
}

const getTopic = async () => {
    if (topics.length < 1)
        return getList()
    const no = topics[0]
    const url = `https://theqoo.net/${no}`
    console.log(url)
    const exist = await readSave.isExist(url)
    if (exist) {
        topics.shift()
        return getTopic()
    }
    fsExtra.emptyDirSync('save/img')
    await getHtml(url)
        .then(html => {
            const $ = cheerio.load(html.data, { decodeEntities: false })
            const title = $('.theqoo_document_header').children('span.title').text().trim()
            const created = $('.btm_area').children('.side.fr').text().trim()
            const content = $('.rd_body').find('.xe_content').html()
            return {
                no,
                title,
                author: '무명의 더쿠',
                created,
                content
            }
        })
        .then(async data => {
            const imageData = changeImageUrl(data.no, data.content)
            data.content = filter(imageData.content)
            const images = imageData.images
            if (images.length > 0)
                images.map((item, index) => downloadImage(data.no, item, index))
            console.log(data)
            return {
                topic: data,
                images
            }
        })
        .then(async data => {
            const success = await saveTopic(data.topic, data.images, url)
            if (!success)
                return console.log('failed...')
            topics.shift()
            const duration = options.timeout + data.topic.content.length
            console.log(`Re-activate in ${(duration / 1000).toFixed(1)} ms...`)
            setTimeout(() => getTopic(), duration)
        })
}

const saveTopic = async (topic, images, url) => {
    try {
        const saveId = await createSave({
            no: topic.no,
            type: options.type,
            label: options.label,
            board: options.board,
            author: topic.author,
            title: topic.title,
            content: topic.content,
            url,
            created: topic.created,
            isImage: images.length > 0 ? 1 : 0
        })
        if (!saveId)
            return false
        await createSave.saveCounts(saveId)
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

const downloadImage = (no, item, index) => {
    request.defaults({ encoding: null }).get(item.url, header, (error, response, body) => {
        if (error || response.statusCode !== 200)
            return console.log(`${item.url} download failed...`)
        const filename = `/${item.uuid}.gif`
        const path = `save/img/${options.type}-${no}`
        const content = Buffer.from(body, 'base64')
        !fs.existsSync(path) && fs.mkdirSync(path)
        fs.writeFile(path + filename, content, () => {
            // await uploadFile(path + filename)
            if (index < 1) {
                const thumbnail = sharp(content)
                thumbnail.metadata()
                    .then(() => thumbnail.resize(80, 80).toBuffer())
                    .then(result => fs.writeFile(`${path}/thumb.png`, result, async () => {
                        // await uploadFile(`${path}/thumb.png`)
                    }))
            }
        })
    })
}

const changeImageUrl = (no, content) => {
    let images = []
    let array
    const regex = /https:\/\/img.theqoo.net\/([a-zA-Z]{5})/gim
    array = content.match(regex)
    if (array) {
        if (array.length > 0) {
            array.map(url => {
                const uuid = v5(`${Date.now()}-${url}`, MY_NAMESPACE)
                content = content.replace(url, `[img src="/save/img/${options.type}-${no}/${uuid}.gif"]`)
                images.push({
                    url: `https://img.theqoo.net/img/${url.replace(regex, '$1')}.jpg`,
                    uuid
                })
            })
        }
    }
    return {
        content,
        images
    }
}

const filter = text => {
    let result = []
    text = text.replace(/<br>/gim, '[br]')
    text = text.replace(/<(\/script|script)((.|\n)*)(\/script|script)>/gim, '')
    text = text.replace(/(<([^>]+)>)/gim, '')
    text = text.replace(/\[img[^\]]*src=[\"']?([^>\"']+)[\"']?[^\]]*\]/gim, `<p><img src="$1"></p>`)
    result = text.trim().split('[br]')
    result = result.map(item => `<p>${item.trim()}</p>`)
    return result.join('')
}

module.exports = data => {
    options = data
    getList()
}