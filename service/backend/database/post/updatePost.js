const pool = require('..')

module.exports = async (postId, content, stickerId, stickerSelect, imageUrl, voiceUrl) => await pool.query(
  'UPDATE Posts SET content = ?, stickerId = ?, stickerSelect = ?, imageUrl = ?, voiceUrl = ? WHERE id = ?',
  [content, stickerId, stickerSelect, imageUrl, voiceUrl, postId]
)
