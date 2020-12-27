const pool = require('..')

module.exports.count = async userId => {
  const result = await pool.query(
    'SELECT COUNT(*) count FROM Notices WHERE userId = ? AND confirm = 0',
    [userId]
  )
  return result[0].count
}

module.exports.notices = async (userId, page, limit) => {
  const result = await pool.query(
    `SELECT
			n.id,
			n.userId,
			n.topicId,
			n.postId,
			n.confirm,
			t.boardDomain,
			p.author,
			p.content,
			p.stickerId,
			p.stickerSelect,
			p.created,
			p.updated,
			tp.author tagAuthor,
			u.profileImageUrl profile,
			u.level,
			u.icon,
			u.isAdmin admin
		FROM Notices n
		LEFT JOIN Topics t ON t.id = n.topicId
		LEFT JOIN Posts p ON p.id = n.postId
		LEFT JOIN Posts tp ON tp.id = p.postParentId
		LEFT JOIN Users u ON u.id = p.userId
		WHERE n.userId = ? AND n.confirm = 0
		ORDER BY n.id DESC
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
