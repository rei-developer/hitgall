const pool = require('..')

module.exports = async id => await pool.query(
    'DELETE FROM Topics WHERE id = ?',
    [id]
)

module.exports.topicImages = async topicId => await pool.query(
    'DELETE FROM TopicImages WHERE topicId = ?',
    [topicId]
)

module.exports.topicImagesByURL = async (topicId, imageUrl) => await pool.query(
    'DELETE FROM TopicImages WHERE topicId = ? AND imageUrl = ?',
    [topicId, imageUrl]
)

module.exports.topicSaves = async userId => await pool.query(
    'DELETE FROM TopicSaves WHERE userId = ?',
    [userId]
)