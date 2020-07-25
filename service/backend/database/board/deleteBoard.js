const pool = require('..')

module.exports.blind = async (domain, ip) => await pool.query(
    'DELETE FROM Blinds WHERE domain = ? AND ip = ?',
    [domain, ip]
)