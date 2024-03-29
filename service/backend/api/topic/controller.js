const client = require('nekos.life')
const {nsfw} = new client()
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

const deleteFile = async key => {
  await s3.deleteObject({
    Bucket: BUCKET_NAME,
    Key: key
  }, (err, data) => {
    if (err)
      console.log(err)
    fs.unlink(key, () => console.log(`s3 : ${BUCKET_NAME}/${key} - deleted.`))
  })
}

const fs = require('fs')
const redis = require('redis')
const moment = require('moment')
const Filter = require('../../lib/filter')
const SpamChecker = require('../../lib/spam')
// const socket = require('../../lib/socket.io')
const User = require('../../lib/user')
const createPoll = require('../../database/poll/createPoll')
const createNotice = require('../../database/notice/createNotice')
const createPost = require('../../database/post/createPost')
const createTopic = require('../../database/topic/createTopic')
const createRemoveLog = require('../../database/removeLog/createRemoveLog')
const readBoard = require('../../database/board/readBoard')
const readNotice = require('../../database/notice/readNotice')
const readPost = require('../../database/post/readPost')
const readTopic = require('../../database/topic/readTopic')
const readUser = require('../../database/user/readUser')
const updateNotice = require('../../database/notice/updateNotice')
const updateSticker = require('../../database/sticker/updateSticker')
const updatePost = require('../../database/post/updatePost')
const updateTopic = require('../../database/topic/updateTopic')
const deletePoll = require('../../database/poll/deletePoll')
const deleteNotice = require('../../database/notice/deleteNotice')
const deletePost = require('../../database/post/deletePost')
const deleteTopic = require('../../database/topic/deleteTopic')

// const client = redis.createClient()

//const BEST_LIMIT = 3
// const DELETE_LIMIT = 10

module.exports.getTopicWidgetList = async ctx => {
  const sidebar = ctx.request.query.sidebar
  if (sidebar !== 'Y' && sidebar !== 'N')
    ctx.throw(400, 'Invalid parameter value')
  const girlImageList = await readTopic.getTopicWidgetList({
    boardDomain: 'girl',
    isImage: 1,
    isAllowed: 1
  }, sidebar === 'Y' ? 15 : 10)
  const animeImageList = await readTopic.getTopicWidgetList({
    boardDomain: 'anime',
    isImage: 1,
    isAllowed: 1
  }, sidebar === 'Y' ? 15 : 10)
  const girlList = sidebar === 'N'
    ? await readTopic.getTopicWidgetList({boardDomain: 'girl', isAllowed: 1}, 30)
    : []
  const otherList = sidebar === 'N'
    ? await readTopic.getTopicWidgetList({boardDomain: 'anime', isAllowed: 1}, 30)
    : []
  ctx.body = {
    status: 'DONE',
    girlImageList,
    animeImageList,
    girlList,
    otherList
  }
}

module.exports.getTopicThumbList = async ctx => {
  const result = await readTopic.getTopicThumbList()
  ctx.body = {
    status: 'DONE',
    result
  }
}

module.exports.getTopicCounts = async ctx => {
  const {domain} = ctx.params
  const counts = await readTopic.counts(domain)
  if (!counts)
    return ctx.body = {
      status: 'fail'
    }
  ctx.body = counts
}

module.exports.getTopics = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const best = body.best || 0
  const domain = body.domain || 'all'
  const userId = body.userId || 0
  const category = body.category || ''
  const searches = body.searches || {
    text: '',
    select: 0
  }
  const page = body.page || 0
  const limit = body.limit || 42
  if (page < 0)
    return
  if (limit < 5 || limit > 50)
    return
  const obj = {}
  if (best > 0)
    obj.isBest = 1
  if (domain === 'best')
    obj.isBest = 1
  else if (domain !== 'all')
    obj.boardDomain = domain
  if (userId > 0)
    obj.userId = userId
  if (category !== '')
    obj.category = category
  obj.isAllowed = 1
  const count = await readTopic.count(obj)
  const categories = await readBoard.categories(domain)
  let notices = await readTopic.notices(domain) || []
  if (notices.length > 0)
    notices = notices.map(item => {
      item.ip = SpamChecker.hideIp(item.ip)
      return item
    })
  let topics = await readTopic.topics(obj, searches, page, limit) || []
  if (topics.length > 0)
    topics = topics.map(item => {
      item.ip = SpamChecker.hideIp(item.ip)
      return item
    })
  ctx.body = {
    count,
    categories,
    notices,
    topics
  }
}

module.exports.getListToWidget = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const domain = body.domain || 'best'
  const page = body.page || 0
  const limit = body.limit || 3
  if (limit < 3 || limit > 20)
    return
  const obj = {}
  if (domain === 'best')
    obj.isBest = 2
  else if (domain !== 'all')
    obj.boardDomain = domain
  obj.isAllowed = 1
  const topics = await readTopic.topicsToWidget(obj, page, limit)
  ctx.body = {
    topics
  }
}

module.exports.getPosts = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const topicId = body.id || 0
  const page = body.page || 0
  const limit = body.limit || 20
  if (topicId < 0 || page < 0)
    return
  if (limit < 10 || limit > 50)
    return
  const topicIp = await readTopic.ip(topicId)
  const count = await readPost.count(topicId)
  let posts = await readPost.posts(topicId, page, count) //limit -> count 임시
  if (posts)
    posts = posts.map(item => {
      item.sameUser = item.userId < 1 ? topicIp === item.ip : null
      item.ip = SpamChecker.hideIp(item.ip)
      return item
    })
  ctx.body = {
    count,
    posts
  }
}

module.exports.getMyPosts = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const userId = body.userId || 0
  const page = body.page || 0
  const limit = body.limit || 20
  if (userId < 0 || page < 0)
    return
  if (limit < 10 || limit > 50)
    return
  const count = await readPost.countByMe(userId)
  const posts = await readPost.postsByMe(userId, page, limit)
  ctx.body = {
    count,
    posts
  }
}

module.exports.getImages = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const page = body.page || 0
  const limit = body.limit || 20
  if (page < 0)
    return
  if (limit < 5 || limit > 50)
    return
  const items = await readTopic.images(page, limit)
  ctx.body = {
    items,
    status: 'ok'
  }
}

module.exports.getBoardLevel = async ctx => {
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  const {domain} = ctx.params
  const boardLevel = user
    ? (user.isAdmin < 1 ? await readBoard.adminBoardManagerLevel(user.id, domain) : 3)
    : 0
  ctx.body = boardLevel
}

module.exports.getCategories = async ctx => {
  const {domain} = ctx.params
  const categories = await readBoard.categories(domain)
  ctx.body = categories
}

module.exports.getContent = async ctx => {
  const {id} = ctx.params
  const user = await User.getUser(ctx.get('x-access-token'))
  let topic = await readTopic(id)
  if (!topic || topic.isAllowed < 1)
    return ctx.body = {
      message: '접근할 수 없거나 삭제된 페이지입니다.',
      status: 'fail'
    }
  topic.ip = SpamChecker.hideIp(topic.ip)
  topic.header = ''
  const viewData = await readUser.viewImage(user.id)
  var images = topic.isImage > 0
    ? await readTopic.topicImages(id)
    : []
  var boardImageUrl = topic.isImage < 1
    ? await readBoard.imageUrl(topic.boardDomain)
    : null
  const boardLevel = user
    ? (user.isAdmin < 1 ? await readBoard.adminBoardManagerLevel(user.id, topic.boardDomain) : 3)
    : 0
  await updateTopic.updateTopicCountsByHits(id)
  let count = 0
  if (user) {
    await updateNotice.updateNoticeByConfirm(user.id, id)
    count = await readNotice.count(user.id)
  }
  var regex = /<p><img\ssrc="([a-zA-Z0-9\-_:/.]+)"\salt="([a-zA-Z0-9\-_:/.]+)"><\/p>/gi
  switch (viewData.viewImage) {
    case 0 ://일반
      break
    case 1 ://이미지만 안보기
      var images = []
      topic.content = topic.content.replace(regex, '')
      break
    case 2 ://노짤만 안보기
      var boardImageUrl = false
      break
    case 3 ://다 안보기
      var images = []
      topic.content = topic.content.replace(regex, '')
      var boardImageUrl = false
      break
    default :
      break
  }
  ctx.body = {
    topic,
    images,
    boardImageUrl,
    boardLevel,
    count
  }
}

module.exports.getSavedContent = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      status: 'fail'
    }
  const topic = await readTopic.topicSaves(user.id)
  ctx.body = {
    topic: topic || {
      color: '',
      title: '',
      content: '<p></p>',
      isNotice: 0
    }
  }
}

module.exports.createTopic = async ctx => {
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  let {
    domain,
    isNotice,
    category,
    color,
    writer,
    password,
    title,
    content,
    poll,
    images
  } = ctx.request.body
  if (domain === null || domain === '')
    domain = 'anime'
  if (title === '' || content === '<p></p>')
    return
  if (title.length > 60)
    return ctx.body = {
      message: '제목은 60자 제한입니다.',
      status: 'fail'
    }
  writer = Filter.disable(writer)
  password = Filter.disable(password)
  title = Filter.disable(title)
  content = Filter.topic(content)
  content = content.replace(/storage.googleapis.com\/hitgall/gim, 'hitgall.com')
  if (color !== '')
    color = color.replace('#', '')
  const ip = ctx.get('x-real-ip')
  const header = ctx.header['user-agent']
  const {agencyAllowed, vpnAllowed, notuserAllowed, isAdminOnly} = await readBoard.isAdminOnly(domain)
  if (agencyAllowed < 1 && SpamChecker.checkAgency(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 통신사 IP 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (vpnAllowed < 1 && SpamChecker.checkVPN(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 VPN 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (notuserAllowed < 1 && !user) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 유동 계정을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (isAdminOnly < 0)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  const userId = user ? user.id : 0
  const isExist = await readBoard.adminBoardBlind(domain, ip, userId)
  if (isExist) {
    const days = moment().diff(moment(isExist.blockDate), 'days')
    if (days <= 0)
      return ctx.body = {
        message: `현재 해당 갤러리에서 차단된 상태입니다. (${moment(isExist.blockDate).format('YYYY-MM-DD')} 까지)`,
        status: 'fail'
      }
  }
  if (user) {
    if (user.isAdmin < isAdminOnly)
      return ctx.body = {
        message: '권한이 없습니다.',
        status: 'fail'
      }
    const level = await readBoard.adminBoardManagerLevel(user.id, domain)
    if (!level && user.isAdmin < 1) {
      // TODO: 관리자 전용 커스텀
      if (color !== '')
        color = ''
      if (isNotice > 0)
        isNotice = 0
    }
  } else {
    if (isAdminOnly > 0)
      return ctx.body = {
        message: '권한이 없습니다.',
        status: 'fail'
      }
    // TODO: 관리자 전용 커스텀
    if (color !== '')
      color = ''
    if (isNotice > 0)
      isNotice = 0
  }
  const isPoll = !poll.hide
  const isImage = images.length > 0
    ? true
    : false
  const topicId = await createTopic({
    userId: user ? user.id : 0,
    boardDomain: domain,
    category,
    color,
    author: user ? user.nickname : writer,
    password,
    title,
    content,
    ip,
    header,
    isPoll,
    isImage,
    isNotice
  })
  await createTopic.createTopicCounts(topicId)
  if (isPoll) {
    const question = poll.question || ''
    const texts = poll.texts.replace(/\n+/gi, '|').trim()
    const regdate = moment(poll.regdate || new Date()).format('YYYY/MM/DD')
    await createPoll(topicId, question, texts, regdate)
  }
  if (isImage)
    await createTopic.createTopicImages(topicId, domain, images)
  if (user) {
    await deleteTopic.topicSaves(user.id)
    await User.setUpPoint(user, 10)
  }
  // await socket.newTopic(global.io, topicId, domain, title)
  ctx.body = {
    topicId,
    status: 'ok'
  }
}

module.exports.createTopicSave = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      status: 'fail'
    }
  let {
    isNotice,
    color,
    title,
    content
  } = ctx.request.body
  if (title === '' && content === '<p></p>')
    return
  title = Filter.disable(title)
  content = Filter.topic(content)
  if (color !== '')
    color = color.replace('#', '')
  const topic = await readTopic.topicSaves(user.id)
  if (topic) {
    await updateTopic.updateTopicSaves(
      user.id,
      color,
      title,
      content,
      isNotice
    )
  } else {
    await createTopic.createTopicSaves(
      user.id,
      color,
      title,
      content,
      isNotice
    )
  }
  ctx.body = {
    status: 'ok'
  }
}

module.exports.createPost = async ctx => {
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  let {
    domain,
    writer,
    password,
    topicId,
    topicUserId,
    postUserId,
    postRootId,
    postParentId,
    content,
    sticker,
    image,
    voice
  } = ctx.request.body
  topicUserId = Number(topicUserId)
  if (postUserId)
    postUserId = Number(postUserId)
  writer = Filter.post(writer)
  password = Filter.post(password)
  content = Filter.post(content)
  const ip = ctx.get('x-real-ip')
  const header = ctx.header['user-agent']
  const {agencyAllowed, vpnAllowed, notuserAllowed} = await readBoard.isAdminOnly(domain)
  if (agencyAllowed < 1 && SpamChecker.checkAgency(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 통신사 IP 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (vpnAllowed < 1 && SpamChecker.checkVPN(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 VPN 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (notuserAllowed < 1 && !user) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 유동 계정을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  const userId = user ? user.id : 0
  const isExist = await readBoard.adminBoardBlind(domain, ip, userId)
  if (isExist) {
    const days = moment().diff(moment(isExist.blockDate), 'days')
    if (days <= 0)
      return ctx.body = {
        message: `현재 해당 갤러리에서 차단된 상태입니다. (${moment(isExist.blockDate).format('YYYY-MM-DD')} 까지)`,
        status: 'fail'
      }
  }
  const postId = await createPost({
    userId: user ? user.id : 0,
    topicId,
    postRootId,
    postParentId,
    boardDomain: domain,
    author: user ? user.nickname : writer,
    password,
    content,
    stickerId: sticker.id,
    stickerSelect: sticker.select,
    imageUrl: image,
    voiceUrl: voice,
    ip,
    header
  })
  const postsCount = await readPost.count(topicId)
  const posts = await readPost.posts(topicId, 0, 100)
  if (sticker.id)
    await updateSticker.inventoryUpdated(user.id, sticker.id)
  if (user) {
    await User.setUpPoint(user, 5)
    const items = []
    if (user.id !== topicUserId)
      items.push(topicUserId)
    if (postUserId && user.id !== postUserId && topicUserId !== postUserId && postUserId > 0)
      items.push(postUserId)
    const jobs = items.map(receiver => new Promise(async resolve => {
      await createNotice(receiver, topicId, postId)
      resolve(true)
    }))
    await Promise.all(jobs)
  }
  // await socket.newPost(global.io, topicId)
  ctx.body = {
    postId,
    postsCount,
    posts,
    status: 'ok'
  }
}

module.exports.createTopicVotes = async ctx => {
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  let {domain, id, likes} = ctx.request.body
  const {bestLimit, isAdminOnly} = await readBoard.isAdminOnly(domain)
  if (id < 1)
    return
  const topic = await readTopic(id)
  if (!topic)
    return ctx.body = {
      status: 'fail'
    }
  const targetUser = await readUser(topic.userId) || 0
  const ip = ctx.get('x-real-ip')
  if (topic.ip === ip && user.isAdmin < 1) // topic.userId === user.id ||
    return ctx.body = {
      message: '본인에게 투표할 수 없습니다.',
      status: 'fail'
    }
  const duration = moment.duration(moment().diff(topic.created))
  const hours = duration.asHours()
  if (hours > 72)
    return ctx.body = {
      message: '3일이 지난 게시물은 투표할 수 없습니다.',
      status: 'fail'
    }
  const date = await readTopic.topicVotes(user ? user.id : 0, id, likes, ip)
  if (date && user.isAdmin < 1) {
    const created = moment(date).format('YYYY/MM/DD HH:mm:ss')
    return ctx.body = {
      message: `이미 투표한 게시물입니다. (${created})`,
      status: 'fail'
    }
  }
  await createTopic.createTopicVotes(user ? user.id : 0, id, likes, ip)
  let move = ''
  if (likes) {
    if (topic.isBest === 0 && topic.likes - topic.hates >= (bestLimit - 1)) {
      move = 'BEST'
      await updateTopic.updateTopicByIsBest(id, 1)
      if (targetUser > 0)
        await User.setUpExpAndPoint(targetUser, 100, 100)
    } else {
      if (targetUser > 0)
        await User.setUpExpAndPoint(targetUser, 5, 5)
    }
    await updateTopic.updateTopicCountsByLikes(id)
  } else {
    if (topic.isBest === 1 && topic.hates - topic.likes >= (bestLimit - 1)) {
      move = 'DEFAULT'
      await updateTopic.updateTopicByIsBest(id)
      if (targetUser > 0)
        await User.setUpExpAndPoint(targetUser, -20, -20)
    } else {
      if (targetUser > 0)
        await User.setUpExpAndPoint(targetUser, -5, -5)
    }
    await updateTopic.updateTopicCountsByHates(id)
  }
  ctx.body = {
    move,
    likes: topic.likes,
    hates: topic.hates,
    status: 'ok'
  }
}

module.exports.updateTopic = async ctx => {
  const {id} = ctx.params
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const topic = await readTopic.edit(id)
  if (!topic.userId)
    return ctx.body = {
      status: 'fail'
    }
  if (user.isAdmin < 1 && topic.userId !== user.id)
    return
  let {
    domain,
    isNotice,
    category,
    color,
    title,
    content,
    poll,
    images
  } = ctx.request.body
  if (title === '' || content === '<p></p>')
    return
  if (title.length > 60)
    return ctx.body = {
      message: '제목은 60자 제한입니다.',
      status: 'fail'
    }
  title = Filter.disable(title)
  content = Filter.topic(content)
  content = content.replace(/storage.googleapis.com\/hitgall/gim, 'hitgall.com')
  if (color !== '')
    color = color.replace('#', '')
  const ip = ctx.get('x-real-ip')
  const {agencyAllowed, vpnAllowed, notuserAllowed, isAdminOnly} = await readBoard.isAdminOnly(domain)
  if (agencyAllowed < 1 && SpamChecker.checkAgency(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 통신사 IP 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (vpnAllowed < 1 && SpamChecker.checkVPN(ip)) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 VPN 이용을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (notuserAllowed < 1 && !user) {
    return ctx.body = {
      message: '해당 갤러리 매니저가 유동 계정을 금지하고 있습니다.',
      status: 'fail'
    }
  }
  if (isAdminOnly < 0)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1) {
    // TODO: 관리자 전용 커스텀
    if (color !== '')
      color = ''
    if (isNotice > 0)
      isNotice = 0
  }
  const isPoll = !poll.hide
  const updateIsPoll = topic.isPoll || (!topic.isPoll && isPoll)
  const isImage = images.length > 0
    ? true
    : false
  await updateTopic(
    id,
    category,
    color,
    title,
    content,
    updateIsPoll,
    isImage,
    isNotice
  )
  if (topic.isPoll && isPoll) {
    await deletePoll(id)
    await deletePoll.pollVotes(id)
  }
  if (isPoll) {
    const question = poll.question || ''
    const texts = poll.texts.replace(/\n+/gi, '|').trim()
    const regdate = moment(poll.regdate || new Date()).format('YYYY/MM/DD')
    await createPoll(id, question, texts, regdate)
  }
  const regex = /<img[^>]*alt=[\"']?([^>\"']+)[\"']?[^>]*>/mig
  let findImages = []
  let xArray
  while (xArray = regex.exec(content))
    findImages.push(xArray[1])
  const topicImages = await readTopic.topicImages(id)
  let imagesByURL = []
  if (topicImages.length > 0)
    topicImages.map(item => imagesByURL.push(item.imageUrl))
  const trashImages = imagesByURL.filter(item => !findImages.includes(item))
  if (trashImages) {
    const jobs = trashImages.map(image => new Promise(async resolve => {
      await deleteFile(`img/${image.imageUrl}`).catch(console.error)
      resolve(true)
    }))
    await Promise.all(jobs)
    const jobsForThumb = trashImages.map(image => new Promise(async resolve => {
      await deleteFile(`img/thumb/${image.imageUrl}`).catch(console.error)
      resolve(true)
    }))
    await Promise.all(jobsForThumb)
    const jobsForDB = trashImages.map(image => new Promise(async resolve => {
      await deleteTopic.topicImagesByURL(id, image)
      resolve(true)
    }))
    await Promise.all(jobsForDB)
  }
  if (isImage)
    await createTopic.createTopicImages(id, domain, images)
  ctx.body = {
    topicId: id,
    status: 'ok'
  }
}

module.exports.updateTopicByIsNotice = async ctx => {
  const {id, domain} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  const boardLevel = user
    ? (user.isAdmin < 1 ? await readBoard.adminBoardManagerLevel(user.id, domain) : 3)
    : 0
  if (boardLevel < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  const topic = await readTopic(id)
  if (!topic)
    return ctx.body = {
      status: 'fail'
    }
  await updateTopic.updateTopicByIsNotice(id)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.updatePost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const {id, content, sticker, image, voice} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const userId = await readPost.userId(id)
  if (!userId)
    return ctx.body = {
      status: 'fail'
    }
  if (user && user.isAdmin < 1 && userId !== user.id)
    return
  await updatePost(id, Filter.post(content), sticker.id, sticker.select, image, voice)
  if (sticker.id)
    await updateSticker.inventoryUpdated(user.id, sticker.id)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.deleteTopic = async ctx => {
  let {id, password} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  const topic = await readTopic.edit(id)
  let level = 0
  if (!user) {
    if (password !== topic.password || topic.userId > 0)
      return ctx.body = {
        message: '비밀번호가 일치하지 않거나 삭제할 수 없는 게시물입니다.',
        status: 'fail'
      }
  } else {
    level = await readBoard.adminBoardManagerLevel(user.id, topic.boardDomain)
    if (user && user.isAdmin < 1 && !level && topic.userId !== user.id)
      return ctx.body = {
        message: '삭제 권한이 없습니다.',
        status: 'fail'
      }
  }
  if (topic.isPoll) {
    await deletePoll(id)
    await deletePoll.pollVotes(id)
  }
  const images = await readTopic.topicImages(id)
  if (images) {
    const jobs = images.map(image => new Promise(async resolve => {
      await deleteFile(`img/${image.imageUrl}`).catch(console.error)
      resolve(true)
    }))
    await Promise.all(jobs)
    const jobsForThumb = images.map(image => new Promise(async resolve => {
      await deleteFile(`img/thumb/${image.imageUrl}`).catch(console.error)
      resolve(true)
    }))
    await Promise.all(jobsForThumb)
    await deleteTopic.topicImages(id)
  }
  await deleteNotice.topicId(id)
  await deletePost.topicId(id)
  if (user && user.isAdmin > 0)
    await deleteTopic(id)
  else
    await updateTopic.updateTopicByIsAllowed(id)
  if (user && (level > 0 || user.isAdmin > 0))
    await createRemoveLog(user.id, topic.boardDomain, topic.author, topic.title, topic.ip)
  // if (topic.userId > 0)
  //     await User.setUpPoint(topic.userId, -20)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.deletePost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const {id} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const userId = await readPost.userId(id)
  if (!userId)
    return ctx.body = {
      status: 'fail'
    }
  if (user.isAdmin < 1 && userId !== user.id)
    return
  await deleteNotice.postId(id)
  await deletePost(id)
  await User.setUpPoint(user, -10)
  ctx.body = {
    status: 'ok'
  }
}
