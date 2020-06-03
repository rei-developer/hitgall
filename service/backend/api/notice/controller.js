const User = require('../../lib/user')
const readNotice = require('../../database/notice/readNotice')
const updateNotice = require('../../database/notice/updateNotice')
const deleteNotice = require('../../database/notice/deleteNotice')

module.exports.getCount = async ctx => {
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    const count = await readNotice.count(user.id)
    ctx.body = {
        count,
        status: 'ok'
    }
}

module.exports.getNotices = async ctx => {
    const {
        ...body
    } = ctx.request.body
    const page = body.page || 0
    const limit = body.limit || 5
    if (page < 0 || limit < 5 || limit > 50)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    const notices = await readNotice.notices(user.id, page, limit)
    ctx.body = {
        notices,
        status: 'ok'
    }
}

module.exports.deleteNotice = async ctx => {
    const { id } = ctx.params
    if (id < 1)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    await deleteNotice.id(id, user.id)
    ctx.body = {
        status: 'ok'
    }
}

module.exports.deleteNotices = async ctx => {
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    await deleteNotice(user.id)
    ctx.body = {
        status: 'ok'
    }
}

module.exports.updateNoticeByConfirm = async ctx => {
    const { id, flag } = ctx.params
    if (id < 1 || flag < 0 || flag > 1)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    await updateNotice.id(id, user.id, flag)
    ctx.body = {
        status: 'ok'
    }
}

module.exports.updateNoticesByConfirm = async ctx => {
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    await updateNotice(user.id)
    ctx.body = {
        status: 'ok'
    }
}