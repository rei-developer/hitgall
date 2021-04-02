const pool = require('..')

module.exports.inventoryItem = async (userId, stickerId, date) => await pool.query(
  'UPDATE StickerInventory SET regdate = ? WHERE userId = ? AND stickerId = ?',
  [date, userId, stickerId]
)

module.exports.inventoryUpdated = async (userId, stickerId) => await pool.query(
  'UPDATE StickerInventory SET used = used + 1 WHERE userId = ? AND stickerId = ?',
  [userId, stickerId]
)
