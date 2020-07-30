const pool = require('..')

module.exports.isExist = async url => {
    const result = await pool.query('SELECT `url` FROM Saves WHERE `url` = ?', url)
    if (result.length < 1)
        return false
    return result[0].url
}