const pool = require('..')

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