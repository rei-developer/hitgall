const {v5} = require('uuid')
const fs = require('fs')
const sharp = require('sharp')
const axios = require('axios')
const request = require('request')
const cheerio = require('cheerio')
const filter = require('../util/filter')
const S3 = require('aws-sdk/clients/s3')
const AWS = require('aws-sdk')
const wasabiEndpoint = new AWS.Endpoint('s3.us-west-1.wasabisys.com')
const {getSaveURL} = require('./database/save/read')
const {
  putSave,
  putSaveCount,
  putSaveImage,
  putSaveFile,
  putSaveMagnet
} = require('./database/save/create')
const dotenv = require('dotenv')
dotenv.config()

const {
  bucketName: BUCKET_NAME,
  bucketRegion: BUCKET_REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
} = require('./bucket.json')

const NAMESPACE = '7d849d8b-7294-46ab-87a0-8851fb3c9256'
const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: BUCKET_REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
})

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

module.exports = class Worker {
  constructor(domain, timeout, boardList) {
    this.domain = domain
    this.boardList = boardList
    this.tab = 0
    this.page = 1
    this.timeout = timeout
    this.topics = []
    global.isRunning = true
    this.getTopicList()
  }

  getTopicList = async () => {
    if (this.tab >= this.boardList.length) {
      global.isRunning = false
      return console.info(`FINISH WORK ${new Date().getDate()}`)
    }
    const URL = `${this.domain}/topic/index?category1=${this.boardList[this.tab].category1}&category2=${this.boardList[this.tab].category2}&page=${this.page++}`
    console.info(URL)
    const data = await this.getHTMLSource(URL)
    try {
      const $ = cheerio.load(data)
      const $body = $('ul.customer_table').children().not(':first-child')
      const topics = []
      $body.each(function () {
        const link = $(this).find('li.tit').find('a').attr('href').trim()
        topics.push(link)
      })
      const $pagination = $('ul.pagination')
      const $disabled = $pagination.find('li.next.disabled')
      if ($pagination.length < 1 || $disabled.length > 0) {
        ++this.tab
        const TIMEOUT = this.timeout + Math.floor(Math.random() * 5000)
        console.info(`Next tab in ${(TIMEOUT / 1000).toFixed(1)} ms...`)
        return setTimeout(() => this.getTopicList(), TIMEOUT)
      }
      this.topics = topics
      this.getTopicContent()
    } catch (error) {
      console.info(error.message)
      setTimeout(() => this.getTopicList(), 300000)
    }
  }

  getTopicContent = async () => {
    if (this.topics.length < 1)
      return this.getTopicList()
    const domain = this.domain
    const URL = `${domain}${this.topics[0]}`
    console.info(URL)
    const saveURL = await getSaveURL(URL)
    if (saveURL) {
      ++this.tab
      const TIMEOUT = this.timeout + Math.floor(Math.random() * 5000)
      console.info(`Next tab in ${(TIMEOUT / 1000).toFixed(1)} ms...`)
      return setTimeout(() => this.getTopicList(), TIMEOUT)
      // this.topics.shift()
      // return this.getTopicContent()
    }
    const data = await this.getHTMLSource(URL)
    try {
      const $ = cheerio.load(data)
      const $body = $('.mmnewlist')
      const $header = $body.find('table.notice_table')
      const $content = $body.find('.sub_content')
      const $category = $body.find('.sub_title_text').find('strong')
      let category = ''
      let subCategory = ''
      $category.each(function (i) {
        if (i === 0)
          category = $(this).text().trim()
        else if (i === 1)
          subCategory = $(this).text().trim()
      })
      const title = $body.find('.sub_view_title').text().trim()
      let download = []
      let magnet = []
      $header.each(function (idx) {
        const name = $(this).find('thead').text().trim()
        const size = $(this).find('tbody').children().first().children().last().text().trim().replace(/ +/g, '')
        const torrentURL = $(this).find('a.bbs_btn1').attr('href')
        const magnetURL = $(this).find('tbody').children().last().find('a.bbs_btn2').attr('href')
        console.info(name)
        download.push({
          idx,
          name,
          size,
          url: `${domain}${torrentURL}`,
          ext: 'torrent'
        })
        magnet.push({
          idx,
          url: magnetURL
        })
      })
      let content = $content.html().trim()
      const changedContent = this.changeImageURL(content)
      content = changedContent.content
      const images = changedContent.images
      if (images.length > 0)
        images.map((item, idx) => this.getImageDownload(item, idx))
      const insertIdx = await this.save({
        board: this.boardList[this.tab].board,
        category,
        subCategory,
        title,
        content
      }, images, URL)
      if (!insertIdx)
        return console.error('FAIL')
      await putSaveCount(insertIdx)
      if (images.length > 0) {
        images.map(async (item, index) => await this.saveImage({
          saveIdx: insertIdx,
          imageIdx: index,
          uuid: item.uuid
        }))
      }
      if (download.length > 0) {
        download.map(async item => {
          const UUID = v5(`${Date.now()}-${item.url}`, NAMESPACE)
          this.getFileDownload(item, UUID)
          await this.saveFile({
            saveIdx: insertIdx,
            fileIdx: item.idx,
            name: item.name,
            size: item.size,
            ext: item.ext,
            uuid: UUID
          })
        })
      }
      if (magnet.length > 0) {
        magnet.map(async item => {
          await this.saveMagnet({
            saveIdx: insertIdx,
            magnetIdx: item.idx,
            url: item.url
          })
        })
      }
      this.topics.shift()
      const TIMEOUT = this.timeout + content.length + Math.floor(Math.random() * 5000)
      console.info(`Re-activate in ${(TIMEOUT / 1000).toFixed(1)} ms...`)
      setTimeout(() => this.getTopicContent(), TIMEOUT)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500)
          this.topics.shift()
      }
      console.info(error.message)
      setTimeout(() => this.getTopicContent(), 300000)
    }
  }

  save = async (topic, images, url) => {
    try {
      return await putSave({
        board: topic.board,
        category: topic.category,
        sub_category: topic.subCategory,
        title: topic.title,
        content: topic.content,
        url,
        is_image: images.length > 0 ? 1 : 0
      })
    } catch (error) {
      console.error(error)
      return false
    }
  }

  saveImage = async image => {
    try {
      await putSaveImage(image)
    } catch (error) {
      console.error(error)
    }
  }

  saveFile = async file => {
    try {
      await putSaveFile(file)
    } catch (error) {
      console.error(error)
    }
  }

  saveMagnet = async magnet => {
    try {
      await putSaveMagnet(magnet)
    } catch (error) {
      console.error(error)
    }
  }

  changeImageURL = content => {
    let images = []
    let array = content.match(/<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/gim)
    if (array) {
      if (array.length > 0) {
        array.map(item => {
          const match = item.match(/([\'\"]).+?\1/gim)
          const url = match.length > 0
            ? `${this.domain}${match[0].replace(/[\'\"]/g, '')}`
            : null
          const UUID = v5(`${Date.now()}-${url}`, NAMESPACE)
          content = content.replace(item, `[img src="/img/${UUID}.jpg"]`)
          content = filter(
            content,
            `<video><p><pre><q><br><b><h1><h2><h3><h4><h5><h6><hr><span><strong><em><u><s><sub><sup><address><ol><ul><li><blockquote><img><iframe><embed><object><param><table><tbody><tr><td><code><audio><source>`
          )
          images.push({
            url,
            uuid: UUID
          })
        })
      }
    }
    return {
      content,
      images
    }
  }

  uploadFile = async name => {
    await storage.bucket(BUCKET_NAME).upload(name, {
      gzip: true,
      destination: name,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    })
    console.info(`${name} uploaded to ${BUCKET_NAME}`)
  }

  getImageDownload = (item, idx) => {
    const path = 'img'
    const thumbPath = 'thumb'
    const fileName = `/${item.uuid}.jpg`
    !fs.existsSync(path) && fs.mkdirSync(path)
    !fs.existsSync(thumbPath) && fs.mkdirSync(thumbPath)
    request
      .defaults({encoding: null})
      .get(item.url, this.getHeader(), (error, response, body) => {
        if (error || response.statusCode !== 200)
          return console.error(error || `${item.link} DOWNLOAD FAILED`)
        const content = Buffer.from(body, 'base64')
        fs.writeFile(`${path}${fileName}`, content, async () => {
          await this.uploadFile(`${path}${fileName}`)
          if (idx < 1) {
            const thumb = sharp(content)
            thumb.metadata()
              .then(() => thumb.resize(100, 100).toBuffer())
              .then(result => fs.writeFile(`${thumbPath}${fileName}`, result, async () => await this.uploadFile(`${thumbPath}${fileName}`)))
          }
        })
      })
  }

  getFileDownload = (item, uuid) => {
    const path = item.ext === 'torrent' ? 'torrent' : 'file'
    const fileName = `/${uuid}.${item.ext}`
    !fs.existsSync(path) && fs.mkdirSync(path)
    request
      .defaults({encoding: null})
      .get(item.url)
      .pipe(fs.createWriteStream(`${path}${fileName}`))
      .on('finish', async () => await this.uploadFile(`${path}${fileName}`))
  }

  getHTMLSource = async url => {
    try {
      const {data} = await axios.get(url, {header: this.getHeader()})
      return data
    } catch (error) {
      console.error(error)
    }
  }

  getHeader = () => {
    return {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Host': this.domain,
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
    }
  }
}
