// const cron = require('./src/crawler/dc-hit')
// cron({
//     type: 'DC',
//     label: 'hit',
//     page: 0,
//     maxPage: 1
// })

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

const axios = require('axios')
const cheerio = require('cheerio')
const { v5 } = require('uuid')
const moment = require('moment')
const dotenv = require('dotenv')
dotenv.config()

const { BUCKET_NAME, MY_NAMESPACE } = process.env

const getHtml = async url => {
    try {
        return await axios.get(url, { header })
    } catch (error) {
        console.error(error)
    }
}

/* 1. 목록 받아오기
 * 2. 목록 하나당 게시물 받아오기
 * 3. 수집 및 가공, 수록
 * 4. 이미지 다운로드
 * 5. 목록 다 끝나면 다음 목록 받아오기 (재귀)
 */

const board = 'hit'
const timeout = 5000
let page = 1
let topics = []

const getList = async () => {
    const url = `https://gall.dcinside.com/board/lists/?id=${board}&page=${page++}`
    await getHtml(url)
        .then(html => {
            let ulList = []
            const $ = cheerio.load(html.data)
            const $bodyList = $('.gall_listwrap.list').find('tr.us-post')
            $bodyList.each(function (i, el) {
                ulList[i] = $(this).attr('data-no')
            })
            return ulList
        })
        .then(res => {
            topics = res
            getTopic()
        })
}

const getTopic = async () => {
    if (topics.length < 1)
        return getList()
    const url = `https://m.dcinside.com/board/${board}/${topics[0]}`
    await getHtml(url)
        .then(html => {
            const $ = cheerio.load(html.data, { decodeEntities: false })
            const title = $('.title_subject').text()
            const author = $('.nickname.in').eq(0).attr('title')
            const datetime = $('.gall_date').eq(0).attr('title')
            const content = $('.writing_view_box').children().html()
            return {
                title,
                author,
                datetime,
                content
            }
        })
        .then(data => {
            const imageData = changeImageUrl(data.content)
            const content = filter(imageData.content)
            const images = imageData.images
            console.log(content)
            const duration = content.length
            topics.shift()
            setTimeout(() => getTopic(), timeout + duration)
        })
}

const changeImageUrl = content => {
    let images = []
    let array
    const regex = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/gim
    array = content.match(regex)
    if (array.length > 0) {
        array.map(item => {
            const regex2 = /((http|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim
            const origin = item.match(regex2)[0]
            const url = origin.replace(/\:\/\/([^\/?#]+)/, '://images.dcinside.com')
            const uuid = v5(`${Date.now()}-${url}`, MY_NAMESPACE)
            content = content.replace(item, `[img src="/save/img/${uuid}.gif"]`)
            images.push({
                origin,
                url,
                uuid
            })
        })
    }
    return {
        content,
        images
    }
}

const filter = text => {
    let result = []
    text = text.replace(/<br>/gim, '[br]')
    text = text.replace(/(<([^>]+)>)/gim, '')
    text = text.replace(/\[img[^\]]*src=[\"']?([^>\"']+)[\"']?[^\]]*\]/gim, `<p><img src="$1"></p>`)
    result = text.trim().split('[br]')
    result = result.map(item => `<p>${item.trim()}</p>`)
    return result.join('')
}

module.exports = () => getList()