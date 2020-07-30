const pool = require('..')
const _ = require('lodash')

module.exports.info = async domain => {
    const result = await pool.query(
        `SELECT
            b.name,
            b.description,
            b.imageUrl,
            u.nickname masterName
        FROM Boards b
        LEFT JOIN Users u ON u.id = b.masterId
        WHERE domain = ?`,
        [domain]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.imageUrl = async domain => {
    const result = await pool.query(
        'SELECT imageUrl FROM Boards WHERE domain = ?',
        [domain]
    )
    if (result.length < 1)
        return false
    return result[0].imageUrl
}

module.exports.adminBoardInfo = async (userId, isAdmin, domain) => {
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
        `SELECT
            bm.level boardLevel,
            b.domain,
            b.name
        FROM BoardManagers bm
        LEFT JOIN Boards b ON b.domain = bm.boardDomain
        WHERE bm.userId = ? OR ? > 0`,
        [userId, isAdmin]
    )
    if (result.length < 1)
        return false
    return result
}

module.exports.adminBoardManagers = async domain => {
    const result = await pool.query(
        `SELECT
            bm.level,
            u.nickname
        FROM BoardManagers bm
        LEFT JOIN Users u ON u.id = bm.userId
        WHERE bm.boardDomain = ?`,
        [domain]
    )
    if (result.length < 1)
        return false
    return result
}

module.exports.adminBoardManagerLevel = async (userId, domain) => {
    const result = await pool.query(
        `SELECT level FROM BoardManagers WHERE userId = ? AND boardDomain = ?`,
        [userId, domain]
    )
    if (result.length < 1)
        return false
    return result[0].level
}

module.exports.adminBoardBlind = async (domain, ip) => {
    const result = await pool.query(
        `SELECT blockDate FROM Blinds WHERE domain = ? AND ip = ?`,
        [domain, ip]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.adminBoardBlinds = async domain => {
    const result = await pool.query(
        `SELECT * FROM Blinds WHERE domain = ? ORDER BY id DESC LIMIT 50`,
        [domain]
    )
    if (result.length < 1)
        return false
    return result
}

module.exports.adminBoardRemoveLogs = async domain => {
    const result = await pool.query(
        `SELECT
            rl.author,
            rl.ip,
            rl.title,
            rl.created,
            u.nickname remover
        FROM RemoveLogs rl
        LEFT JOIN Users u ON u.id = rl.userId
        WHERE rl.domain = ?
        ORDER BY rl.id DESC
        LIMIT 50`,
        [domain]
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