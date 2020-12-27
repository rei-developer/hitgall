const pool = require('..')

module.exports.updatePickByLikes = async (pickId, likes = 1) => await pool.query(
  'UPDATE Picks SET likes = likes + ? WHERE id = ?',
  [likes, pickId]
)
