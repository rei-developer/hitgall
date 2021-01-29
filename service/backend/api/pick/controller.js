const Filter = require('../../lib/filter')
const User = require('../../lib/user')
const createPick = require('../../database/pick/createPick')
const createPickPost = require('../../database/pickPost/createPickPost')
const deletePickPost = require('../../database/pickPost/deletePickPost')
const readPick = require('../../database/pick/readPick')
const readPickPost = require('../../database/pickPost/readPickPost')
const updatePick = require('../../database/pick/updatePick')
const updatePickPost = require('../../database/pickPost/updatePickPost')

module.exports.getPicks = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const userId = body.userId || 0
  const searches = body.searches || {
    text: '',
    select: 0
  }
  const page = body.page || 0
  const limit = body.limit || 100
  if (page < 0)
    return
  if (limit < 10 || limit > 100)
    return
  const obj = {}
  if (userId > 0)
    obj.userId = userId
  obj.isAllowed = 1
  const count = await readPick.count(obj)
  const picks = await readPick.picks(obj, searches, page, limit)
  console.log(count)
  console.log(picks)
  ctx.body = {
    count,
    picks
  }
}

module.exports.getPickPosts = async ctx => {
  const {
    ...body
  } = ctx.request.body
  const pickId = body.id || 0
  const page = body.page || 0
  const limit = body.limit || 20
  if (pickId < 0 || page < 0)
    return
  if (limit < 10 || limit > 50)
    return
  const count = await readPickPost.count(pickId)
  const posts = await readPickPost.posts(pickId, page, limit)
  ctx.body = {
    count,
    posts
  }
}

module.exports.getContent = async ctx => {
  const {id} = ctx.params
  if (id < 1)
    return
  const pick = await readPick(id)
  if (!pick || pick.isAllowed < 1)
    return ctx.body = {
      status: 'fail'
    }
  ctx.body = {
    pick
  }
}

module.exports.createPick = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  let {name, groupname, pureGroupname, filename} = ctx.request.body
  if (name === '' || groupname === '' || pureGroupname === '')
    return
  name = Filter.disable(name)
  groupname = Filter.disable(groupname)
  pureGroupname = Filter.disable(pureGroupname)
  const pickId = await createPick(
    {userId: user.id, name, groupname, pureGroupname, profileImageUrl: filename}
  )
  ctx.body = {
    pickId,
    status: 'ok'
  }
}

module.exports.createPickPost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  let {
    pickId,
    topicUserId,
    postUserId,
    postRootId,
    postParentId,
    content,
    sticker
  } = ctx.request.body
  topicUserId = Number(topicUserId)
  if (postUserId)
    postUserId = Number(postUserId)
  content = Filter.post(content)
  const ip = ctx.get('x-real-ip')
  const header = ctx.header['user-agent']
  const postId = await createPickPost({
    userId: user.id,
    pickId,
    postRootId,
    postParentId,
    author: user.nickname,
    content,
    stickerId: sticker.id,
    stickerSelect: sticker.select,
    ip,
    header
  })
  const postsCount = await readPickPost.count(pickId)
  const posts = await readPickPost.posts(pickId, 0, 100)
  ctx.body = {
    postId,
    postsCount,
    posts,
    status: 'ok'
  }
}

module.exports.createPickVotes = async ctx => {
  let {id} = ctx.request.body
  if (id < 1)
    return
  const pick = await readPick(id)
  if (!pick)
    return ctx.body = {
      status: 'fail'
    }
  const ip = ctx.get('x-real-ip')
  const date = await readPick.pickVotes(ip)
  if (date)
    return ctx.body = {
      message: '오늘은 이미 투표에 참여했습니다.',
      status: 'fail'
    }
  await createPick.createPickVotes(id, ip)
  await updatePick.updatePickByLikes(id)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.updatePickPost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const {id, content, sticker} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const userId = await readPickPost.userId(id)
  if (!userId)
    return ctx.body = {
      status: 'fail'
    }
  if (user.isAdmin < 1 && userId !== user.id)
    return
  await updatePickPost(id, Filter.post(content), sticker.id, sticker.select)
  ctx.body = {
    status: 'ok'
  }
}

module.exports.deletePickPost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const {id} = ctx.request.body
  if (id < 1)
    return ctx.body = {
      status: 'fail'
    }
  const userId = await readPickPost.userId(id)
  if (!userId)
    return ctx.body = {
      status: 'fail'
    }
  if (user.isAdmin < 1 && userId !== user.id)
    return
  await deletePickPost(id)
  ctx.body = {
    status: 'ok'
  }
}
