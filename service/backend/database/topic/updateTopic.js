const pool = require('..')

module.exports = async (topicId, category, color, title, content, isPoll, isImage, isNotice) => await pool.query(
    'UPDATE Topics SET category = ?, color = ?, title = ?, content = ?, isPoll = ?, isImage = ?, isNotice = ? WHERE id = ?',
    [category, color, title, content, isPoll, isImage, isNotice, topicId]
)

module.exports.updateTopicByIsBest = async (topicId, isBest = 0) => await pool.query(
    'UPDATE Topics SET isBest = ? WHERE id = ?',
    [isBest, topicId]
)

module.exports.updateTopicByIsNotice = async topicId => await pool.query(
    'UPDATE Topics SET isNotice = NOT(isNotice) WHERE id = ?',
    [topicId]
)

module.exports.updateTopicByIsAllowed = async (topicId, isAllowed = 0) => await pool.query(
    'UPDATE Topics SET isAllowed = ? WHERE id = ?',
    [isAllowed, topicId]
)

module.exports.updateTopicCountsByHits = async (topicId, hits = 1) => await pool.query(
    'UPDATE TopicCounts SET hits = hits + ? WHERE topicId = ?',
    [hits, topicId]
)

module.exports.updateTopicCountsByLikes = async (topicId, likes = 1) => await pool.query(
    'UPDATE TopicCounts SET likes = likes + ? WHERE topicId = ?',
    [likes, topicId]
)

module.exports.updateTopicCountsByHates = async (topicId, hates = 1) => await pool.query(
    'UPDATE TopicCounts SET hates = hates + ? WHERE topicId = ?',
    [hates, topicId]
)

module.exports.updateTopicSaves = async (userId, color, title, content, isNotice) => await pool.query(
    'UPDATE TopicSaves SET color = ?, title = ?, content = ?, isNotice = ? WHERE userId = ?',
    [color, title, content, isNotice, userId]
)