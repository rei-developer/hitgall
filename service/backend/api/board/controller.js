const fs = require('fs')
const redis = require('redis')
const moment = require('moment')
const Filter = require('../../lib/filter')
// const socket = require('../../lib/socket.io')
const User = require('../../lib/user')

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
    const board = await readBoard.adminBoardInfo(user.id, user.isAdmin, domain)
    if (!board)
        return ctx.body = {
            message: '권한이 없습니다.',
            status: 'fail'
        }
    const blinds = await readBoard.adminBoardBlinds(domain)
    ctx.body = {
        blinds
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
    const board = await readBoard.adminBoardInfo(user.id, user.isAdmin, domain)
    if (!board)
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
    const board = await readBoard.adminBoardInfo(user.id, user.isAdmin, domain)
    if (!board)
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