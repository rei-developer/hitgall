const pool = require('..')

module.exports = async () => {
    const result = await pool.query('SELECT * FROM Workers WHERE `working` = 1')
    if (result.length < 1)
        return false
    return result
}