const pool = require('..')

module.exports.getSaveList = async () => {
  const result = await pool.query('SELECT idx, title, content FROM SAVES')
  if (result.length < 1)
    return false
  return result
}

module.exports.getSaveURL = async url => {
  const result = await pool.query('SELECT `url` FROM SAVES WHERE `url` = ?', url)
  if (result.length < 1)
    return false
  return result[0].url
}
