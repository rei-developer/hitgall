const pool = require('..')
const _ = require('lodash')

module.exports = async id => {
  const result = await pool.query(
    `SELECT
			s.userId,
      s.category,
			s.author,
			s.title,
			s.content,
			s.created,
			s.updated,
			s.isImage,
			s.isAllowed,
			sc.hits,
			sc.likes,
			sc.hates
		FROM Saves s
		LEFT JOIN SaveCounts sc ON sc.saveId = s.id
		WHERE s.id = ?`,
    [id]
  )
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.count = async columns => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `SELECT COUNT(*) count FROM Saves WHERE ${keys.map(key => `${key} = ?`).join(' AND ')} ORDER BY id DESC`,
      [...values]
    )
    return result[0].count
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.counts = async domain => {
  const result = await pool.query(`SELECT COUNT(*) today FROM Saves WHERE created > CURDATE()`)
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.topics = async (columns, searches, page, limit) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  let query = ''
  let data = []
  if (searches.text !== '') {
    switch (searches.select) {
      case 1:
        query = ' AND MATCH (t.content) AGAINST (?)'
        data = [searches.text]
        break
      case 2:
        query = ' AND MATCH (t.title) AGAINST (?) OR MATCH (t.content) AGAINST (?)'
        data = [searches.text, searches.text]
        break
      case 3:
        query = ' AND MATCH (t.author) AGAINST (?)'
        data = [searches.text]
        break
      default:
        query = ' AND MATCH (t.title) AGAINST (?)'
        data = [searches.text]
        break
    }
  }
  try {
    const result = await pool.query(
      `SELECT
				t.id,
				t.userId,
				t.boardDomain,
        t.category,
        t.color,
				t.author,
				t.title,
				t.created,
				t.isImage,
				t.isBest,
				t.isNotice,
				tc.hits,
				tc.likes,
				u.profileImageUrl profile,
				u.level,
				u.icon,
				u.isAdmin admin,
				(SELECT imageUrl FROM TopicImages WHERE topicId = t.id LIMIT 1) imageUrl,
				(SELECT COUNT(*) FROM Posts WHERE topicId = t.id) postsCount
			FROM Topics t
			LEFT JOIN TopicCounts tc ON tc.topicId = t.id
			LEFT JOIN Users u ON u.id = t.userId
			WHERE ${keys.map(key => `t.${key} = ?`).join(' AND ')}${query}
			ORDER BY t.id DESC
			LIMIT ?, ?`,
      searches.text === ''
        ? [
          ...values,
          page * limit,
          limit
        ]
        : [
          ...values,
          ...data,
          page * limit,
          limit
        ]
    )
    if (result.length < 1)
      return false
    return result
  } catch (e) {
    console.log(e.message)
    return false
  }
}
