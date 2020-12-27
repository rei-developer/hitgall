const pool = require('..')

module.exports.blind = async (domain, id) => await pool.query(
  'DELETE FROM Blinds WHERE domain = ? AND id = ?',
  [domain, id]
)
