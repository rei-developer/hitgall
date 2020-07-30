const jwt = require('jsonwebtoken')
const readUser = require('../database/user/readUser')
const updateUser = require('../database/user/updateUser')

const getUpperByExp = (user, exp) => {
    const sumExp = user.exp + exp
    const maxExp = Math.pow(user.level, 2) * 90
    const underMaxExp = Math.pow(user.level - 1, 2) * 90
    const upper = {
        level: user.level,
        exp: user.exp
    }
    if (user.level < 50 && sumExp >= maxExp) {
        upper.level++
        upper.exp = 0
    } else if (user.level > 0 && sumExp < 0) {
        upper.level--
        upper.exp = underMaxExp + exp
    } else {
        upper.exp += exp
    }
    return upper
}

module.exports.getUser = async (token) => {
    const TOKEN = token || ''
    if (TOKEN.split('.').length < 3)
        return false
    try {
        const result = await new Promise((resolve, reject) => {
            jwt.verify(TOKEN, process.env.JWT_SECRET, async (err, payload) => {
                if (err)
                    return reject(false)
                const user = await readUser(payload.jti)
                if (!user)
                    return reject(false)
                resolve(user)
            })
        })
        return result
    } catch (e) {
        return e
    }
}

module.exports.isAuthenticated = async (ctx, next) => {
    const TOKEN = ctx.get('x-access-token') || ''
    if (TOKEN.split('.').length < 3)
        return
    await jwt.verify(TOKEN, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    err.message = '토큰이 만료되었습니다. 새로 로그인하세요.'
                    break
            }
            return ctx.body = {
                message: err.message,
                status: 'fail'
            }
        }
        const user = await readUser(payload.jti)
        if (!user)
            return ctx.body = {
                message: '존재하지 않는 계정입니다.',
                status: 'fail'
            }
        ctx.state.user = user
        await next()
    })
}

module.exports.setLevel = async (user, level = 1) => {
    await updateUser({
        level
    }, user.id)
}

module.exports.setExp = async (user, exp) => {
    await updateUser({
        exp
    }, user.id)
}

module.exports.setPoint = async (user, point) => {
    await updateUser({
        point
    }, user.id)
}

module.exports.setIcon = async (user, icon) => {
    await updateUser({
        icon
    }, user.id)
}

module.exports.setUpExp = async (user, exp) => {
    const upper = await getUpperByExp(user, exp)
    await updateUser({
        level: upper.level,
        exp: upper.exp
    }, user.id)
}

module.exports.setUpPoint = async (user, point) => {
    await updateUser({
        point: Number(user.point) + Number(point)
    }, user.id)
}

module.exports.setUpExpAndPoint = async (user, exp, point) => {
    const upper = await getUpperByExp(user, exp)
    await updateUser({
        level: upper.level,
        exp: upper.exp,
        point: user.point + point
    }, user.id)
}