const pool = require('..')

module.exports = async id => await pool.query(
  'DELETE FROM Posts WHERE id = ?',
  [id]
)

module.exports.topicId = async topicId => await pool.query(
  'DELETE FROM Posts WHERE topicId = ?',
  [topicId]
)
