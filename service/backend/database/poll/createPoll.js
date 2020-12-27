const pool = require('..')

module.exports = async (topicId, question, texts, regdate) => {
  await pool.query(
    'INSERT INTO Polls (topicId, question, texts, regdate) VALUES (?, ?, ?, ?)',
    [topicId, question, texts, regdate]
  )
}

module.exports.votes = async (userId, topicId, select, ip) => await pool.query(
  'INSERT INTO PollVotes (userId, topicId, selected, ip) VALUES (?, ?, ?, ?)',
  [userId, topicId, select, ip]
)
