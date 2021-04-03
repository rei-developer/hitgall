const moment = require('moment')
const User = require('../../lib/user')
const createSticker = require('../../database/sticker/createSticker')
const readSticker = require('../../database/sticker/readSticker')
const updateSticker = require('../../database/sticker/updateSticker')

module.exports.getInventoryItemView = async ctx => {
  const {id} = ctx.params
  if (id < 1)
    return
  let days = 0
  const token = ctx.get('x-access-token')
  const user = token !== '' ? await User.getUser(token) : null
  if (user) {
    const check = await readSticker.check(user.id, id)
    if (!check)
      return ctx.body = {
        status: 'fail'
      }
    days = moment(check.regdate).diff(moment(), 'days')
  }
  const sticker = await readSticker.sticker(id)
  ctx.body = {
    sticker,
    days,
    status: 'ok'
  }
}

module.exports.getInventoryItem = async ctx => {
  const {id} = ctx.params
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
  const defaultItems = [{
    id: 110,
    number: 22,
    ext: 'jpg',
    name: '슬픈 개구리 페페'
  }, {
    id: 146,
    number: 57,
    ext: 'jpg',
    name: '슬픈 개구리 페페'
  }]
  let inventory = user
    ? (await readSticker.inventory(user.id) || [])
    : []
  ctx.body = {
    inventory: [...inventory, ...defaultItems],
    status: 'ok'
  }
}

module.exports.getStickers = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const page = body.page || 0
  const limit = body.limit || 24
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
  const {id, buyNum} = ctx.request.body
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
  try {
    await User.setUpPoint(user, -(sticker.price * buyNum))
  } catch (e) {
    console.log(e)
  }
  ctx.body = {
    date,
    status: 'ok'
  }
}
