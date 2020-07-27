const pool = require('..')

module.exports.blind = async (userId, targetUserId, domain, author, description, ip, blockDate) => await pool.query(
    'INSERT INTO Blinds (userId, targetUserId, domain, author, description, ip, blockDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, targetUserId, domain, author, description, ip, blockDate]
)