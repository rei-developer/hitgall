const fs = require('fs')
const redis = require('redis')
const moment = require('moment')
const Filter = require('../../lib/filter')
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
    const { domain } = ctx.params
    if (!domain)
        return
    const board = await readBoard.info(domain)
    ctx.body = {
        board
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
    const { domain } = ctx.params
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
    if (blinds) {
        blinds = blinds.map(item => {
            const ip = item.ip.split('.')
            if (ip && ip.length >= 3)
                item.ip = `${ip[0]}.${ip[1]}`
            else
                item.ip = ''
            return item
        })
    }
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
    const { domain } = ctx.params
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
    const removes = await readBoard.adminBoardRemoveLogs(domain)
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
    const { domain } = ctx.params
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
    const { domain } = ctx.params
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
        description
    } = ctx.request.body
    if (description === null)
        description = ''
    description = Filter.disable(description)
    await updateBoard({
        description
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
    const { domain } = ctx.params
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
    const isExist = await readBoard.adminBoardBlind(topic.boardDomain, topic.ip)
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
    const { domain } = ctx.params
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
        ip
    } = ctx.request.body
    await deleteBoard.blind(domain, ip)
    ctx.body = {
        status: 'ok'
    }
}