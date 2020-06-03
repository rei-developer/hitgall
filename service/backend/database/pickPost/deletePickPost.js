const pool = require('..')

module.exports = async id => await pool.query(
    'DELETE FROM PickPosts WHERE id = ?',
    [id]
)