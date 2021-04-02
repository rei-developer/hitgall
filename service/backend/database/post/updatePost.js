const pool = require('..')

module.exports = async (postId, content, stickerId, stickerSelect, voiceUrl) => await pool.query(
  'UPDATE Posts SET content = ?, stickerId = ?, stickerSelect = ?, voiceUrl = ? WHERE id = ?',
  [content, stickerId, stickerSelect, voiceUrl, postId]
)
