const pool = require('..')

module.exports = async userId => await pool.query(
    'DELETE FROM Notices WHERE userId = ?',
    [userId]
)

module.exports.id = async (id, userId) => await pool.query(
    'DELETE FROM Notices WHERE id = ? AND userId = ?',
    [id, userId]
)

module.exports.topicId = async topicId => await pool.query(
    'DELETE FROM Notices WHERE topicId = ?',
    [topicId]
)

module.exports.postId = async postId => await pool.query(
    'DELETE FROM Notices WHERE postId = ?',
    [postId]
)