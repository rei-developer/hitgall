const pool = require('..')

module.exports = async (postId, content, stickerId, stickerSelect) => await pool.query(
    'UPDATE PickPosts SET content = ?, stickerId = ?, stickerSelect = ? WHERE id = ?',
    [content, stickerId, stickerSelect, postId]
)