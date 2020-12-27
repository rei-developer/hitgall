const Filter = require('../../lib/filter')
const User = require('../../lib/user')
const createIcon = require('../../database/icon/createIcon')
const readIcon = require('../../database/icon/readIcon')

module.exports.getIcons = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const page = body.page || 0
  const limit = body.limit || 20
  const count = await readIcon.count()
  const icons = await readIcon.icons(page, limit)
  ctx.body = {
    count,
    icons,
    status: 'ok'
  }
}

module.exports.createIcon = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  let {name, description, price, filename} = ctx.request.body
  if (name === '' || description === '')
    return
  name = Filter.disable(name)
  description = Filter.disable(description)
  await createIcon({name, description, price, filename})
  ctx.body = {
    status: 'ok'
  }
}

module.exports.buy = async ctx => {
  const {id} = ctx.request.body
  if (id < 1)
    return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const icon = await readIcon(id)
  if (!icon)
    return
  if (user.point < icon.price)
    return ctx.body = {
      message: '포인트가 부족합니다.',
      status: 'fail'
    }
  await User.setIcon(user, icon.filename)
  await User.setUpPoint(user, -icon.price)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.remove = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  await User.setIcon(user, '')
  ctx.body = {
    status: 'ok'
  }
}
