const pool = require('..')
const _ = require('lodash')

module.exports.putSave = async columns => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `INSERT INTO SAVES SET ${keys.map(key => `${key} = ?`).join(', ')}`,
      [...values]
    )
    return result.insertId
  } catch (error) {
    console.error(error)
    return false
  }
}

module.exports.putSaveCount = async saveIdx => await pool.query(
  'INSERT INTO SAVE_COUNTS (save_idx) VALUES (?)',
  [saveIdx]
)

module.exports.putSaveFile = async ({saveIdx, fileIdx, name, size, ext, uuid}) => await pool.query(
  'INSERT INTO SAVE_FILES (save_idx, file_idx, name, size, ext, uuid) VALUES (?, ?, ?, ?, ?, ?)',
  [saveIdx, fileIdx, name, size, ext, uuid]
)

module.exports.putSaveMagnet = async ({saveIdx, magnetIdx, url}) => await pool.query(
  'INSERT INTO SAVE_MAGNETS (save_idx, magnet_idx, url) VALUES (?, ?, ?)',
  [saveIdx, magnetIdx, url]
)

module.exports.putSaveImage = async ({saveIdx, imageIdx, uuid}) => await pool.query(
  'INSERT INTO SAVE_IMAGES (save_idx, image_idx, uuid) VALUES (?, ?, ?)',
  [saveIdx, imageIdx, uuid]
)
