const pool = require('..')

module.exports.getNo = async () => {
    const result = await pool.query('SELECT no FROM Topics ORDER BY no DESC LIMIT 1')
    if (result.length < 1)
        return false
    return result[0].no
}