const pool = require('..')
const _ = require('lodash')

module.exports = async id => {
    const result = await pool.query('SELECT * FROM Stickers WHERE id = ?', [id])
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.count = async columns => {
    let keys = []
    let values = []
    _.forIn(columns, (value, key) => {
        keys.push(key)
        values.push(value)
    })
    try {
        const result = await pool.query(
            `SELECT COUNT(*) count FROM Stickers WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`,
            [...values]
        )
        return result[0].count
    } catch (e) {
        console.log(e.message)
        return false
    }
}

module.exports.sticker = async id => {
    const result = await pool.query(
        'SELECT * FROM Stickers WHERE id = ?',
        [id]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.stickers = async (columns, page, limit) => {
    let keys = []
    let values = []
    _.forIn(columns, (value, key) => {
        keys.push(key)
        values.push(value)
    })
    try {
        const result = await pool.query(
            `SELECT * FROM Stickers WHERE ${keys.map(key => `${key} = ?`).join(' AND ')} ORDER BY name LIMIT ?, ?`,
            [
                ...values,
                page * limit,
                limit
            ]
        )
        if (result.length < 1)
            return false
        return result
    } catch (e) {
        console.log(e.message)
        return false
    }
}

module.exports.check = async (userId, stickerId) => {
    const result = await pool.query(
        'SELECT id, regdate FROM StickerInventory WHERE userId = ? AND stickerId = ?',
        [userId, stickerId]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.inventory = async userId => {
    const result = await pool.query(
        `SELECT
			si.stickerId id,
			s.number,
			s.ext,
			s.name
		FROM StickerInventory si
		LEFT JOIN Stickers s ON s.id = si.stickerId
		WHERE si.userId = ? AND TIME_TO_SEC(TIMEDIFF(si.regdate, NOW())) > 0`,
        [userId]
    )
    if (result.length < 1)
        return false
    return result
}