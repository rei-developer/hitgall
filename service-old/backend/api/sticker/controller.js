const moment = require('moment')
const User = require('../../lib/user')
const createSticker = require('../../database/sticker/createSticker')
const readSticker = require('../../database/sticker/readSticker')
const updateSticker = require('../../database/sticker/updateSticker')

module.exports.getInventoryItem = async ctx => {
    const { id } = ctx.params
    if (id < 1)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    const check = await readSticker.check(user.id, id)
    if (!check)
        return ctx.body = {
            status: 'fail'
        }
    const days = moment(check.regdate).diff(moment(), 'days')
    ctx.body = {
        days,
        status: 'ok'
    }
}

module.exports.getInventory = async ctx => {
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    const inventory = await readSticker.inventory(user.id)
    ctx.body = {
        inventory,
        status: 'ok'
    }
}

module.exports.getStickers = async ctx => {
    const {
        ...body
    } = ctx.request.body
    const page = body.page || 0
    const limit = body.limit || 20
    const tags = body.tags || ''
    const obj = {}
    if (tags !== '전체')
        obj.tags = tags
    obj.isAllowed = 1
    const count = await readSticker.count(obj)
    const stickers = await readSticker.stickers(obj, page, limit)
    ctx.body = {
        count,
        stickers,
        status: 'ok'
    }
}

module.exports.createInventoryItem = async ctx => {
    const { id, buyNum } = ctx.request.body
    if (id < 1)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    const sticker = await readSticker(id)
    if (!sticker)
        return
    if (user.point < (sticker.price * buyNum))
        return ctx.body = {
            message: '포인트가 부족합니다.',
            status: 'fail'
        }
    const check = await readSticker.check(user.id, id)
    let date
    if (check) {
        const min = moment().diff(moment(check.regdate), 'minutes')
        date = moment(
            min > 0
                ? new Date()
                : check.regdate,
            'R'
        )
            .add((sticker.days * buyNum), 'days')
            .format('YYYY-MM-DD HH:mm:ss')
        await updateSticker.inventoryItem(user.id, id, date)
    } else {
        date = moment(new Date(), 'R')
            .add((sticker.days * buyNum), 'days')
            .format('YYYY-MM-DD HH:mm:ss')
        await createSticker.inventoryItem(user.id, id, date)
    }
    await User.setUpPoint(user, -(sticker.price * buyNum))
    ctx.body = {
        date,
        status: 'ok'
    }
}