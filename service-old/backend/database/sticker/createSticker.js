const pool = require('..')

module.exports.inventoryItem = async (userId, stickerId, date) => await pool.query(
    'INSERT INTO StickerInventory (userId, stickerId, regdate) VALUES (?, ?, ?)',
    [userId, stickerId, date]
)