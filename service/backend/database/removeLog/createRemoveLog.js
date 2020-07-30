const pool = require('..')

module.exports = async (userId, domain, author, title, ip) => await pool.query(
    'INSERT INTO RemoveLogs (userId, domain, author, title, ip) VALUES (?, ?, ?, ?, ?)',
    [userId, domain, author, title, ip]
)