const pool = require('..')
const _ = require('lodash')

module.exports = async columns => {
    let keys = []
    let values = []
    _.forIn(columns, (value, key) => {
        keys.push(key)
        values.push(value)
    })
    try {
        const result = await pool.query(
            `INSERT INTO Posts SET ${keys.map(key => `${key} = ?`).join(', ')}`,
            [...values]
        )
        return result.insertId
    } catch (e) {
        console.log(e.message)
        return false
    }
}

module.exports.createPostCounts = async postId => await pool.query(
    'INSERT INTO PostCounts (postId) VALUES (?)',
    [postId]
)

module.exports.createPostVotes = async (userId, postId, ip) => await pool.query(
    'INSERT INTO PostVotes (userId, postId, ip) VALUES (?, ?, ?)',
    [userId, postId, ip]
)