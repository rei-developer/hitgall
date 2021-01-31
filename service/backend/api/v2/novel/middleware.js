const {getNovel} = require('../../../database/novel/read')
const User = require('../../../lib/user')

module.exports.authenticated = async (ctx, next) => {
  const idx = ctx.params.idx
  const version = ctx.params.version
  const token = ctx.get('x-access-token')
  const user = await User.getUser(token)
  const novel = await getNovel(idx, version)
  if (!novel)
    return ctx.body = {
      status: 'FAIL',
      message: 'NON_DATA'
    }
  const isOnlyMember = novel.IS_ONLY_MEMBER === 1
  if (isOnlyMember)
    return ctx.body = {
      status: 'FAIL',
      message: 'ONLY_MEMBER'
    }
  ctx.state.idx = idx
  ctx.state.version = version
  ctx.state.user = user
  ctx.state.novel = novel
  await next()
}
