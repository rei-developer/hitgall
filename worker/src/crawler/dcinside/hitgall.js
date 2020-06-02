const fs = require('fs')
const uuidv5 = require('uuid/v5')
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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
}

dotenv.config()

const { MY_NAMESPACE } = process.env

const getContent = async url => {
    try {
        let regex, data
        const result = await new Promise((resolve, reject) => {
            request.get(url, (err, response, body) => {
                if (err || response.statusCode !== 200)
                    return reject({ message: err || 'non-content', status: 'fail' })
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
                        images.map(item => content = content.replace(item.origin, `/img/${item.uuid}.gif`))
                }
                resolve({
                    content,
                    images,
                    status: 'ok'
                })
            })
        })
        return result
    } catch (err) {
        console.error(err)
        return false
    }
}

const download = async item => {
    console.log(item, "ㅎㅇ")
    try {
        const result = await new Promise((resolve, reject) => {
            request.defaults({ encoding: null }).get(item.url, header, (err, response, body) => {
                if (err || response.statusCode !== 200)
                    return reject({ message: err || 'non-content', status: 'fail' })
                const path = './img/' + item.uuid + '.gif'
                const content = Buffer.from(body, 'base64')
                fs.writeFile(path, content, () => resolve({ status: 'ok' }))
            })
        })
        return result
    } catch (err) {
        console.error(err)
        return false
    }
}

module.exports = async () => {
    try {
        const data = await getContent('https://gall.dcinside.com/board/view/?id=hit&no=15827&_rk=JRL&page=1')
        if (data.status === 'fail')
            return console.error(data.message)
        const jobs = data.images.map(item => new Promise(async resolve => {
            const success = await download(item)
            if (!success)
                return reject({ message: 'download failed', status: 'fail' })
            resolve(true)
        }))
        await Promise.all(jobs)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}