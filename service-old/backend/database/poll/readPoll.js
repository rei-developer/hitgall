const pool = require('..')

module.exports = async topicId => {
    const result = await pool.query(
        'SELECT question, texts, regdate, isPrivate FROM Polls WHERE topicId = ?',
        [topicId]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.votes = async topicId => {
    const result = await pool.query(
        'SELECT COUNT(*) count, selected FROM PollVotes WHERE topicId = ? GROUP BY selected',
        [topicId]
    )
    if (result.length < 1)
        return false
    return result
}

module.exports.voted = async (userId, topicId, ip) => {
    const result = await pool.query(
        'SELECT selected, created FROM PollVotes WHERE (userId = ? OR ip = ?) AND topicId = ?',
        [userId, ip, topicId]
    )
    if (result.length < 1)
        return false
    return result[0]
}