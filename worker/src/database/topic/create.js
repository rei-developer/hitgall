const pool = require('..')
const _ = require('lodash')

module.exports = async columns => {
    let keys = []
    let values = []
    _.forIn(columns, (value, key) => {
        keys.push(key)
        values.push(value)
    })
    try {
        const result = await pool.query(
            `INSERT INTO Topics SET ${keys.map(key => `${key} = ?`).join(', ')}`,
            [...values]
        )
        return result.insertId
    } catch (e) {
        console.log(e.message)
        return false
    }
}

module.exports.createTopicImages = async (topicId, domain, items) => {
    await pool.query(
        `INSERT INTO TopicImages (topicId, name, width, height, domain, imageUrl, uuid) VALUES ${items.filter(item => item.filename).map(() => `(?, ?, ?, ?, ?, ?, ?)`).join(', ')}`,
        items.filter(item => item.filename).map(item => [topicId, item.name, item.width, item.height, domain, item.filename, item.uuid]).reduce((acc, current) => [
            ...acc,
            ...current
        ], [])
    )
}