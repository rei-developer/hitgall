const pool = require('..')
const _ = require('lodash')

module.exports = async id => {
  const result = await pool.query(
    `SELECT
			t.userId,
			t.boardDomain,
      t.category,
      t.color,
			t.author,
			t.title,
			t.content,
			t.ip,
			t.header,
			t.created,
			t.updated,
			t.isPoll,
			t.isImage,
			t.isBest,
			t.isNotice,
			t.isAllowed,
			tc.hits,
			tc.likes,
			tc.hates,
			u.level,
			u.icon,
      u.isAdmin admin,
      bm.level boardLevel,
      (SELECT imageUrl FROM TopicImages WHERE topicId = t.id LIMIT 1) imageUrl
		FROM Topics t
		LEFT JOIN TopicCounts tc ON tc.topicId = t.id
        LEFT JOIN Users u ON u.id = t.userId
        LEFT JOIN BoardManagers bm ON (bm.userId = t.userId AND bm.boardDomain = t.boardDomain)
		WHERE t.id = ?`,
    [id]
  )
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.userId = async id => {
  const result = await pool.query('SELECT userId FROM Topics WHERE id = ?', [id])
  if (result.length < 1)
    return false
  return result[0].userId
}

module.exports.ip = async id => {
  const result = await pool.query('SELECT ip FROM Topics WHERE id = ?', [id])
  if (result.length < 1)
    return false
  return result[0].ip
}

module.exports.edit = async id => {
  const result = await pool.query(
    'SELECT userId, boardDomain, author, password, title, ip, isPoll, isImage FROM Topics WHERE id = ?',
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
      `SELECT COUNT(*) count FROM Topics WHERE ${keys.map(key => `${key} = ?`).join(' AND ')} ORDER BY id DESC`,
      [...values]
    )
    return result[0].count
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.counts = async domain => {
  let result
  if (domain === 'all') {
    result = await pool.query(
      `SELECT COUNT(*) today FROM Topics WHERE created > CURDATE()`
    )
    // (SELECT COUNT(*) FROM Topics WHERE created > CURDATE() - INTERVAL 1 DAY)
    // yesterday (SELECT TIMESTAMPDIFF(MINUTE, CURRENT_DATE(), NOW()) / COUNT(*)
    // FROM Topics WHERE created > CURDATE()) regen
  } else if (domain === 'best') {
    result = await pool.query(
      `SELECT COUNT(*) today FROM Topics WHERE created > CURDATE() AND isBest > 1`
    )
    // (SELECT COUNT(*) FROM Topics WHERE created > CURDATE() - INTERVAL 1 DAY AND
    // isBest > 1) yesterday, (SELECT TIMESTAMPDIFF(MINUTE, CURRENT_DATE(), NOW()) /
    // COUNT(*) FROM Topics WHERE created > CURDATE() AND isBest > 1) regen
  } else {
    result = await pool.query(
      `SELECT COUNT(*) today FROM Topics WHERE created > CURDATE() AND boardDomain = ?`,
      [domain]
    )
    // (SELECT COUNT(*) FROM Topics WHERE created > CURDATE() - INTERVAL 1 DAY AND
    // boardDomain = ?) yesterday, (SELECT TIMESTAMPDIFF(MINUTE, CURRENT_DATE(),
    // NOW()) / COUNT(*) FROM Topics WHERE created > CURDATE() AND boardDomain = ?)
    // regen
  }
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.notices = async domain => {
  const result = await pool.query(
    `SELECT
			t.id,
			t.userId,
      t.category,
      t.color,
			t.author,
      t.title,
      t.ip,
			t.created,
			t.isImage,
			t.isBest,
			tc.hits,
			tc.likes,
			u.level,
			u.icon,
      u.isAdmin admin,
      bm.level boardLevel
		FROM Topics t
		LEFT JOIN TopicCounts tc ON tc.topicId = t.id
        LEFT JOIN Users u ON u.id = t.userId
        LEFT JOIN BoardManagers bm ON (bm.userId = t.userId AND bm.boardDomain = t.boardDomain)
		WHERE t.boardDomain = ? AND t.isNotice = 1 AND t.isAllowed = 1
		ORDER BY t.id DESC`,
    [domain]
  )
  if (result.length < 1)
    return false
  return result
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
        query = ' AND MATCH (t.title) AGAINST (?)'
        data = [searches.text]
        break
      case 2:
        query = ' AND MATCH (t.content) AGAINST (?)'
        data = [searches.text]
        break
      case 3:
        query = ' AND MATCH (t.author) AGAINST (?)'
        data = [searches.text]
        break
      default:
        query = ' AND MATCH (t.title) AGAINST (?) OR MATCH (t.content) AGAINST (?)'
        data = [searches.text, searches.text]
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
        t.ip,
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
        bm.level boardLevel,
				(SELECT imageUrl FROM TopicImages WHERE topicId = t.id LIMIT 1) imageUrl,
				(SELECT COUNT(*) FROM Posts WHERE topicId = t.id) postsCount
			FROM Topics t
			LEFT JOIN TopicCounts tc ON tc.topicId = t.id
            LEFT JOIN Users u ON u.id = t.userId
            LEFT JOIN BoardManagers bm ON (bm.userId = t.userId AND bm.boardDomain = t.boardDomain)
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

module.exports.topicsToWidget = async (columns, page, limit) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `SELECT
				t.id,
				t.boardDomain,
        t.color,
				t.title,
				t.created,
				(SELECT imageUrl FROM TopicImages WHERE topicId = t.id LIMIT 1) imageUrl,
				(SELECT COUNT(*) FROM Posts WHERE topicId = t.id) postsCount
			FROM Topics t
			LEFT JOIN TopicCounts tc ON tc.topicId = t.id
			LEFT JOIN Users u ON u.id = t.userId
			WHERE ${keys.map(key => `t.${key} = ?`).join(' AND ')}
            ORDER BY t.id DESC
            LIMIT ?, ?`,
      [
        ...values,
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

module.exports.images = async (page, limit) => {
  const result = await pool.query(
    'SELECT topicId, width, height, imageUrl FROM TopicImages ORDER BY id DESC LIMI' +
    'T ?, ?',
    [
      page * limit,
      limit
    ]
  )
  if (result.length < 1)
    return false
  return result
}

module.exports.topicImages = async topicId => {
  const result = await pool.query(
    'SELECT topicId, name, width, height, domain, imageUrl, uuid FROM TopicImages W' +
    'HERE topicId = ?',
    [topicId]
  )
  if (result.length < 1)
    return false
  return result
}

module.exports.topicSaves = async userId => {
  const result = await pool.query(
    'SELECT * FROM TopicSaves WHERE userId = ?',
    [userId]
  )
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.topicVotes = async (userId, topicId, flag, ip) => {
  const result = await pool.query(
    'SELECT created FROM TopicVotes WHERE topicId = ? AND flag = ? AND (userId = ? OR ip = ?)',
    [topicId, flag, userId, ip]
  )
  if (result.length < 1)
    return false
  return result[0].created
}



const getCommonConditionList = (columns, q, interval, prefix = null) => {
  const purePrefix = prefix ? `${prefix}.` : ''
  let commonConditionList = []
  if (columns)
    _.forIn(columns, (value, key) => commonConditionList.push(`${key} = '${value}'`))
  if (q)
    commonConditionList.push(`title LIKE '%${q}%'`)
  if (interval)
    commonConditionList.push(`${purePrefix}created BETWEEN DATE_ADD(NOW(), INTERVAL -${interval} DAY) AND NOW()`)
  return commonConditionList
}

module.exports.getTopicWidgetList = async (columns, limit, interval) => {
  const commonConditionList = getCommonConditionList(columns, interval)
  try {
    const result = await pool.query(
      `
      SELECT
        A.id,
        A.title,
        B.likes,
        IF(A.isImage = 1, (SELECT imageUrl FROM TopicImages WHERE topicId = A.id ORDER BY id LIMIT 1), NULL) AS imageUrl
      FROM Topics AS A
        INNER JOIN TopicCounts AS B ON (B.topicId = A.id)
      ${commonConditionList.length > 0 ? `WHERE ${commonConditionList.join(' AND ')}` : ''}
      ORDER BY A.id DESC
      LIMIT ?
      `,
      [limit]
    )
    if (result.length < 1)
      return false
    return result
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getTopicThumbList = async () => {
  try {
    const result = await pool.query(
      `
      SELECT
        A.id,
        (SELECT imageUrl FROM TopicImages WHERE topicId = A.id ORDER BY id LIMIT 1) AS imageUrl
      FROM Topics AS A
      WHERE A.isImage = 1
      ORDER BY A.id DESC
      LIMIT 9
      `
    )
    if (result.length < 1)
      return false
    return result
  } catch (error) {
    console.error(error.message)
    return false
  }
}
