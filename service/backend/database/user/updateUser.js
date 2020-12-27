const pool = require('..')
const _ = require('lodash')

module.exports = async (columns, userId) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  await pool.query(
    `UPDATE Users SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`,
    [
      ...values,
      userId
    ]
  )
}

module.exports.password = async (password, salt, userId) => await pool.query(
  'UPDATE Users SET password = ?, salt = ? WHERE id = ?',
  [password, salt, userId]
)
