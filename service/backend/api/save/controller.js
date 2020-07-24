const readSave = require('../../database/save/readSave')

module.exports.getSaveCounts = async ctx => {
    const counts = await readSave.counts()
    if (!counts)
        return ctx.body = {
            status: 'fail'
        }
    ctx.body = counts
}

module.exports.getSaves = async ctx => {
    const {
        ...body
    } = ctx.request.body
    const category = body.category || ''
    const searches = body.searches || {
        text: '',
        select: 0
    }
    const page = body.page || 0
    const limit = body.limit || 20
    if (page < 0)
        return
    if (limit < 5 || limit > 50)
        return
    const obj = {}
    if (category !== '')
        obj.category = category
    obj.isAllowed = 1
    const count = await readSave.count(obj)
    // const categories = await readBoard.categories(domain)
    const saves = await readSave.saves(obj, searches, page, limit)
    ctx.body = {
        count,
        saves
    }
}