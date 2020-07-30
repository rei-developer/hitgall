const pool = require('..')

module.exports = async id => {
    const result = await pool.query('SELECT * FROM Icons WHERE id = ?', [id])
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.count = async () => {
    const result = await pool.query('SELECT COUNT(*) count FROM Icons')
    return result[0].count
}

module.exports.icons = async (page, limit) => {
    const result = await pool.query(
        'SELECT * FROM Icons ORDER BY id DESC LIMIt ?, ?',
        [
            page * limit,
            limit
        ]
    )
    if (result.length < 1)
        return false
    return result
}