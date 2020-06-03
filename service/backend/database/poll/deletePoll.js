const pool = require('..')

module.exports = async topicId => await pool.query(
    'DELETE FROM Polls WHERE topicId = ?',
    [topicId]
)

module.exports.pollVotes = async topicId => await pool.query(
    'DELETE FROM PollVotes WHERE topicId = ?',
    [topicId]
)