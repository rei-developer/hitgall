const pool = require('..')

module.exports.getNo = async no => {
    const result = await pool.query('SELECT `no` FROM Saves WHERE `no` = ?', no)
    if (result.length < 1)
        return false
    return result[0].no
}