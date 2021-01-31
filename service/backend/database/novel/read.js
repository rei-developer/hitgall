const pool = require('..')
// const _ = require('lodash')

module.exports.getNovelPageStartIdx = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT NOVEL_PAGE_START_IDX
      FROM NOVEL_OPTIONS
      WHERE NOVEL_IDX = ?;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0].NOVEL_PAGE_START_IDX
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelScript = async (idx, version, pageIdx, sortNo) => {
  try {
    const result = await pool.query(
      `
      SELECT NOVEL_SCRIPTS.NOVEL_PAGE_IDX,
             NOVEL_SCRIPTS.NOVEL_ACTOR_IDX,
             NOVEL_SCRIPTS.NOVEL_PICTURE_IDX,
             NOVEL_SCRIPTS.NOVEL_BGM_IDX,
             NOVEL_SCRIPTS.NOVEL_BGS_IDX,
             NOVEL_SCRIPTS.NOVEL_SOUND_IDX,
             NOVEL_SCRIPTS.SCRIPT_TYPE,
             NOVEL_SCRIPTS.CUSTOM_NAME,
             NOVEL_SCRIPTS.TEXT,
             NOVEL_SCRIPTS.SORT_NO
      FROM NOVEL_SCRIPTS
      WHERE NOVEL_SCRIPTS.NOVEL_IDX = ?
        AND NOVEL_SCRIPTS.VERSION = ?
        AND NOVEL_SCRIPTS.NOVEL_PAGE_IDX = ?
        AND NOVEL_SCRIPTS.SORT_NO = ?
        AND NOVEL_SCRIPTS.IS_VISIBLE = 1;
      `,
      [idx, version, pageIdx, sortNo]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    return {error: error.code}
  }
}

module.exports.getNovelActor = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT NAME,
             IMAGE_URL
      FROM NOVEL_ACTORS
      WHERE IDX = ?
        AND IS_PUBLIC = 1
        AND IS_VISIBLE = 1;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelBackground = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT IMAGE_URL
      FROM NOVEL_PICTURES
      WHERE IDX = ?
        AND IS_PUBLIC = 1
        AND IS_VISIBLE = 1;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelBGM = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT BGM_URL
      FROM NOVEL_BGM
      WHERE IDX = ?
        AND IS_PUBLIC = 1
        AND IS_VISIBLE = 1;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelBGS = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT BGS_URL
      FROM NOVEL_BGS
      WHERE IDX = ?
        AND IS_PUBLIC = 1
        AND IS_VISIBLE = 1;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelSound = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT SOUND_URL
      FROM NOVEL_SOUNDS
      WHERE IDX = ?
        AND IS_PUBLIC = 1
        AND IS_VISIBLE = 1;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelCount = async () => {
  try {
    const result = await pool.query(
      `
      SELECT COUNT(*) AS COUNT
      FROM NOVELS
      `
    )
    if (result.length < 1)
      return false
    return result[0].COUNT
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelList = async (page, limit) => {
  try {
    const result = await pool.query(
      `
      SELECT IDX,
             CATEGORY,
             TITLE,
             SUB_TITLE,
             DESCRIPTION,
             TAGS,
             IMAGE_URL,
             CREATED_DT,
             UPDATED_DT,
             VERSION
      FROM NOVELS
      WHERE IS_VISIBLE = 1
      ORDER BY UPDATED_DT DESC
      LIMIT ?, ?;
      `,
      [page * limit, limit]
    )
    if (result.length < 1)
      return false
    return result
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovel = async (idx, version) => {
  try {
    const result = await pool.query(
      `
      SELECT NOVELS.IDX,
             NOVELS.TITLE,
             NOVELS.SUB_TITLE,
             NOVELS.VERSION,
             NOVEL_OPTIONS.IS_USE_TITLE,
             NOVEL_OPTIONS.IS_USE_LOGO,
             NOVEL_OPTIONS.IS_USE_GAMEOVER,
             NOVEL_OPTIONS.IS_USE_CUSTOM_CSS,
             NOVEL_OPTIONS.IS_ONLY_MEMBER,
             NOVEL_OPTIONS.IS_ONLY_ADULT,
             NOVEL_PICTURES.IMAGE_URL AS TITLE_IMAGE_URL
      FROM NOVELS
               LEFT JOIN NOVEL_OPTIONS ON (NOVEL_OPTIONS.NOVEL_IDX = NOVELS.IDX)
               LEFT JOIN NOVEL_PICTURES
                         ON (NOVEL_OPTIONS.NOVEL_PICTURE_TITLE_IDX = NOVEL_PICTURES.IDX
                             AND NOVEL_PICTURES.IS_PUBLIC = 1
                             AND NOVEL_PICTURES.IS_VISIBLE = 1
                             )
      WHERE NOVELS.IDX = ?
        AND NOVELS.VERSION = ?
        AND NOVELS.IS_VISIBLE = 1;
      `,
      [idx, version]
    )
    if (result.length < 1)
      return false
    return result[0]
  } catch (error) {
    console.error(error.message)
    return false
  }
}

module.exports.getNovelCustomCssOptions = async idx => {
  try {
    const result = await pool.query(
      `
      SELECT BLOCK_NAME,
             BLOCK_CONTENT
      FROM NOVEL_CUSTOM_CSS_OPTIONS
      WHERE NOVEL_OPTION_IDX = ?;
      `,
      [idx]
    )
    if (result.length < 1)
      return false
    return result
  } catch (error) {
    console.error(error.message)
    return false
  }
}
