const User = require('../../lib/user')
const createPoll = require('../../database/poll/createPoll')
const readPoll = require('../../database/poll/readPoll')

module.exports.getVotes = async ctx => {
    const { id } = ctx.params
    if (id < 1)
        return
    const user = await User.getUser(ctx.get('x-access-token'))
    const ip = ctx.get('x-real-ip')
    const poll = await readPoll(id)
    const votes = await readPoll.votes(id)
    const { selected, created } = user ? await readPoll.voted(user.id, id, ip) : false
    const possible = user && !created
    ctx.body = {
        poll,
        votes,
        selected,
        possible,
        status: 'ok'
    }
}

module.exports.votes = async ctx => {
    const user = await User.getUser(ctx.get('x-access-token'))
    if (!user)
        return
    let { id, select } = ctx.request.body
    if (id < 1)
        return
    const ip = ctx.get('x-real-ip')
    const { created } = await readPoll.voted(user.id, id, ip)
    if (created)
        return ctx.body = {
            status: 'fail'
        }
    await createPoll.votes(user.id, id, select, ip)
    ctx.body = {
        status: 'ok'
    }
}