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
    console.log(`s3 : ${BUCKET_NAME}/${key} - deleted.`)
  })
}

const fs = require('fs')
const redis = require('redis')
const moment = require('moment')
const Filter = require('../../lib/filter')
const SpamChecker = require('../../lib/spam')
// const socket = require('../../lib/socket.io')
const User = require('../../lib/user')

const createBoard = require('../../database/board/createBoard')
const readBoard = require('../../database/board/readBoard')
const readNotice = require('../../database/notice/readNotice')
const readPost = require('../../database/post/readPost')
const readTopic = require('../../database/topic/readTopic')
const readUser = require('../../database/user/readUser')
const updateBoard = require('../../database/board/updateBoard')
const deleteBoard = require('../../database/board/deleteBoard')
const deletePoll = require('../../database/poll/deletePoll')
const deleteNotice = require('../../database/notice/deleteNotice')
const deletePost = require('../../database/post/deletePost')
const deleteTopic = require('../../database/topic/deleteTopic')

module.exports.getBoardInfo = async ctx => {
  const {domain} = ctx.params
  if (!domain)
    return
  const board = await readBoard.info(domain)
  const managers = await readBoard.adminBoardManagers(domain)
  ctx.body = {
    board,
    managers
  }
}

module.exports.getAdminBoards = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const boards = await readBoard.adminBoards(user.id, user.isAdmin)
  ctx.body = {
    boards
  }
}

module.exports.getAdminBoardBlinds = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  let blinds = await readBoard.adminBoardBlinds(domain)
  if (blinds)
    blinds = blinds.map(item => {
      item.ip = SpamChecker.hideIp(item.ip)
      return item
    })
  ctx.body = {
    blinds
  }
}

module.exports.getAdminBoardRemoveLogs = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  let removes = await readBoard.adminBoardRemoveLogs(domain)
  if (removes)
    removes = removes.map(item => {
      item.ip = SpamChecker.hideIp(item.ip)
      return item
    })
  ctx.body = {
    removes
  }
}

module.exports.getAdminBoardInfo = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  const board = await readBoard.adminBoardInfo(user.id, user.isAdmin, domain)
  ctx.body = {
    board
  }
}

module.exports.updateAdminBoardInfo = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  let {
    description,
    imageUrl,
    bestLimit,
    noticeLimit,
    agencyAllowed,
    vpnAllowed,
    notuserAllowed
  } = ctx.request.body
  if (!description)
    description = ''
  description = Filter.disable(description)
  if (imageUrl) {
    const getBoardImageUrl = await readBoard.imageUrl(domain)
    if (getBoardImageUrl && getBoardImageUrl !== '')
      fs.unlink(`img/${getBoardImageUrl}`, () => {
        fs.unlink(`img/thumb/${getBoardImageUrl}`, async () => {
          await deleteFile(`img/${getBoardImageUrl}`)
          await deleteFile(`img/thumb/${getBoardImageUrl}`)
        })
      })
    await updateBoard({
      imageUrl
    }, domain)
  }
  await updateBoard({
    description,
    bestLimit,
    noticeLimit,
    agencyAllowed,
    vpnAllowed,
    notuserAllowed
  }, domain)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.createAdminBoardBlind = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  let {
    topicId,
    description,
    blockDate
  } = ctx.request.body
  if (topicId < 1)
    return ctx.body = {
      message: '존재하지 않는 게시물입니다.',
      status: 'fail'
    }
  if (description === null)
    description = ''
  if (blockDate === null)
    blockDate = moment().add(1, 'year').format('YYYY-MM-DD')
  description = Filter.disable(description)
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  const topic = await readTopic(topicId)
  if (!topic)
    return ctx.body = {
      message: '존재하지 않는 게시물입니다.',
      status: 'fail'
    }
  const isExist = await readBoard.adminBoardBlind(topic.boardDomain, topic.ip, topic.userId)
  if (isExist)
    return ctx.body = {
      message: `이미 차단된 유저입니다. (${moment(isExist.blockDate).format('YYYY-MM-DD')} 까지)`,
      status: 'fail'
    }
  await createBoard.blind(
    user.id,
    topic.userId,
    topic.boardDomain,
    topic.author,
    description,
    topic.ip,
    blockDate
  )
  ctx.body = {
    status: 'ok'
  }
}

module.exports.deleteAdminBoardBlind = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return ctx.body = {
      message: '접근할 수 없습니다.',
      status: 'fail'
    }
  const {domain} = ctx.params
  if (!domain || domain === '')
    return ctx.body = {
      message: '존재하지 않는 갤러리입니다.',
      status: 'fail'
    }
  const level = await readBoard.adminBoardManagerLevel(user.id, domain)
  if (!level && user.isAdmin < 1)
    return ctx.body = {
      message: '권한이 없습니다.',
      status: 'fail'
    }
  let {
    id
  } = ctx.request.body
  await deleteBoard.blind(domain, id)
  ctx.body = {
    status: 'ok'
  }
}
