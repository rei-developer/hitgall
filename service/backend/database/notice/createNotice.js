const pool = require('..')

module.exports = async (userId, topicId, postId) => await pool.query(
  'INSERT INTO Notices (userId, topicId, postId) VALUES (?, ?, ?)',
  [userId, topicId, postId]
)
