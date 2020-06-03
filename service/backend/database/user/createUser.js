const pool = require('..')
const _ = require('lodash')

module.exports = async columns => {
    let keys = []
    let values = []
    _.forIn(columns, (value, key) => {
        keys.push(key)
        values.push(value)
    })
    const result = await pool.query(
        `INSERT INTO Users SET
    	${keys.map(key => `${key} = ?`).join(', ')}`,
        [...values]
    )
    return result.insertId
}