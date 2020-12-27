const pool = require('..')
const _ = require('lodash')

module.exports = async (columns, domain) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  await pool.query(
    `UPDATE Boards SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE domain = ?`,
    [
      ...values,
      domain
    ]
  )
}
