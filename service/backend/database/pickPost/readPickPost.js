const pool = require('..')

module.exports = async id => {
    const result = await pool.query(
        `SELECT
			userId,
			pickId,
			ip,
			created,
			updated
		FROM PickPosts
		WHERE id = ?`,
        [id]
    )
    if (result.length < 1)
        return false
    return result[0]
}

module.exports.userId = async id => {
    const result = await pool.query(
        'SELECT userId FROM PickPosts WHERE id = ?',
        [id]
    )
    if (result.length < 1)
        return false
    return result[0].userId
}

module.exports.count = async pickId => {
    const result = await pool.query(
        'SELECT COUNT(*) count FROM PickPosts WHERE pickId = ?',
        [pickId]
    )
    return result[0].count
}

module.exports.posts = async (pickId, page, limit) => {
    const result = await pool.query(
        `SELECT
			p.id,
			p.userId,
			p.postRootId,
			p.postParentId,
			p.author,
			p.content,
			p.stickerId,
			p.stickerSelect,
			p.created,
			p.updated,
			tp.author tagAuthor,
			tp.userId tagUserId,
			u.profileImageUrl profile,
			u.level,
			u.icon,
			u.isAdmin admin
		FROM PickPosts p
		LEFT JOIN PickPosts tp ON tp.id = p.postParentId
		LEFT JOIN Users u ON u.id = p.userId
		WHERE p.pickId = ?
		ORDER BY IF(ISNULL(p.postRootId), p.id, p.postRootId), p.id
		LIMIt ?, ?`,
        [
            pickId, page * limit,
            limit
        ]
    )
    if (result.length < 1)
        return false
    return result
}