const pool = require('..')
const _ = require('lodash')

module.exports.infomation = async (userId, isAdmin, domain) => {
    const result = await pool.query(
        `SELECT * FROM Boards WHERE (masterId = ? OR ? > 0) AND domain = ?`,
        [userId, isAdmin, domain]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.adminBoards = async (userId, isAdmin) => {
    const result = await pool.query(
        `SELECT * FROM Boards WHERE masterId = ? OR ? > 0`,
        [userId, isAdmin]
    )
    if (result.length < 1)
        return false
    return result
}

module.exports.isAdminOnly = async domain => {
    const result = await pool.query(
        'SELECT isAdminOnly FROM Boards WHERE domain = ?',
        [domain]
    )
    if (result.length < 1)
        return -1
    return result[0].isAdminOnly
}

module.exports.categories = async boardDomain => {
    const result = await pool.query(
        'SELECT text, value FROM Categories WHERE boardDomain = ?',
        [boardDomain]
    )
    if (result.length < 1)
        return false
    return result
}