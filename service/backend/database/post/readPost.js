const pool = require('..')
// const uuidv5 = require('uuid/v5')

// const MY_NAMESPACE = '7d849d8b-7294-46ab-87a0-8851fb3c9256'

module.exports = async id => {
	const result = await pool.query(
		`SELECT
			p.userId,
			p.topicId,
			p.ip,
			p.created,
			p.updated,
			pc.likes,
			pc.hates
		FROM Posts p
		LEFT JOIN PostCounts pc ON pc.postId = p.id
		WHERE p.id = ?`,
		[id]
	)
	if (result.length < 1)
		return false
	return result[0]
}

module.exports.userId = async id => {
	const result = await pool.query('SELECT userId FROM Posts WHERE id = ?', [id])
	if (result.length < 1)
		return false
	return result[0].userId
}

module.exports.count = async topicId => {
	const result = await pool.query(
		'SELECT COUNT(*) count FROM Posts WHERE topicId = ?',
		[topicId]
	)
	return result[0].count
}

module.exports.countByMe = async userId => {
	const result = await pool.query(
		'SELECT COUNT(*) count FROM Posts WHERE userId = ?',
		[userId]
	)
	return result[0].count
}

module.exports.posts = async (topicId, page, limit) => {
	let result = await pool.query(
		`SELECT
			p.id,
			p.userId,
			p.postRootId,
			p.postParentId,
			p.author,
			p.content,
			p.stickerId,
			p.stickerSelect,
			p.ip,
			p.created,
			p.updated,
			tp.author tagAuthor,
			pc.likes,
			pc.hates,
			u.profileImageUrl profile,
			u.level,
			u.icon,
			u.isAdmin admin,
			bm.level boardLevel
		FROM Posts p
		LEFT JOIN Posts tp ON tp.id = p.postParentId
		LEFT JOIN PostCounts pc ON pc.postId = p.id
		LEFT JOIN Users u ON u.id = p.userId
		LEFT JOIN BoardManagers bm ON (bm.userId = p.userId AND bm.boardDomain = p.boardDomain)
		WHERE p.topicId = ?
		ORDER BY IF(ISNULL(p.postRootId), p.id, p.postRootId), p.id
		LIMIt ?, ?`,
		[
			topicId, page * limit,
			limit
		]
	)
	if (result.length < 1)
		return false
	// result = result.map(item => {
	// 	item.tagUserId = uuidv5(item.ip, MY_NAMESPACE)
	// 	return item
	// })
	return result
}

module.exports.postsByMe = async (userId, page, limit) => {
	const result = await pool.query(
		`SELECT
			p.id,
			p.content,
			p.stickerId,
			p.stickerSelect,
			p.created,
			p.updated,
			tp.author tagAuthor,
			pc.likes,
			pc.hates,
			u.profileImageUrl profile
		FROM Posts p
		LEFT JOIN Posts tp ON tp.id = p.postParentId
		LEFT JOIN PostCounts pc ON pc.postId = p.id
		LEFT JOIN Users u ON u.id = p.userId
		WHERE p.userId = ?
		ORDER BY id DESC
		LIMIt ?, ?`,
		[
			userId, page * limit,
			limit
		]
	)
	if (result.length < 1)
		return false
	return result
}

module.exports.postVotes = async (userId, postId, ip) => {
	const result = await pool.query(
		'SELECT created FROM PostVotes WHERE postId = ? AND (userId = ? OR ip = ?)',
		[postId, userId, ip]
	)
	if (result.length < 1)
		return false
	return result[0].created
}