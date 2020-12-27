const pool = require('..')
const _ = require('lodash')

module.exports = async id => {
  const result = await pool.query(
    `SELECT
			userId,
			name,
			groupname,
			pureGroupname,
			created,
			updated,
			likes,
			profileImageUrl profile
		FROM Picks
		WHERE id = ?
		ORDER BY likes DESC`,
    [id]
  )
  if (result.length < 1)
    return false
  return result[0]
}

module.exports.userId = async id => {
  const result = await pool.query('SELECT userId FROM Picks WHERE id = ?', [id])
  if (result.length < 1)
    return false
  return result[0].userId
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
      `SELECT COUNT(*) count FROM Picks WHERE ${keys.map(key => `${key} = ?`).join(' AND ')} ORDER BY id DESC`,
      [...values]
    )
    return result[0].count
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.picks = async (columns, searches, page, limit) => {
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
      case 0:
        query = ' AND MATCH (name) AGAINST (?)'
        data = [searches.text]
        break
      case 1:
        query = ' AND MATCH (groupname) AGAINST (?) OR MATCH (pureGroupname) AGAINST (?)'
        data = [searches.text, searches.text]
        break
    }
  }
  try {
    const result = await pool.query(
      `SELECT
				id,
				userId,
				name,
				groupname,
				pureGroupname,
				created,
				updated,
				likes,
				profileImageUrl profile
			FROM Picks
			WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}${query}
			ORDER BY likes DESC
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

module.exports.pickVotes = async ip => {
  const result = await pool.query(
    'SELECT created FROM PickVotes WHERE created >= DATE_FORMAT(CURDATE(), "%Y-%m-%d") AND ip = ?',
    [ip]
  )
  if (result.length < 1)
    return false
  return result[0].created
}
