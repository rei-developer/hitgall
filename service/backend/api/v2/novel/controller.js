const {
  getNovelPageStartIdx,
  getNovelScript,
  getNovelActor,
  getNovelBackground,
  getNovelBGM,
  getNovelBGS,
  getNovelSound,
  getNovelCount,
  getNovelList,
  getNovelCustomCssOptions
} = require('../../../database/novel/read')

module.exports.getNovelScript = async ctx => {
  const {
    idx,
    version,
    user,
    novel
  } = ctx.state
  const {
    type,
    pageIdx,
    sortNo
  } = ctx.request.body
  const purePageIdx = type === 'READY'
    ? await getNovelPageStartIdx(idx)
    : pageIdx
  const pureSortNo = sortNo + (type === 'NEXT' ? 1 : 0)
  const script = await getNovelScript(idx, version, purePageIdx, pureSortNo)
  if (!script)
    return ctx.body = {
      status: 'FAIL',
      message: 'NON_DATA'
    }
  else if (script.error)
    return ctx.body = {
      status: 'FAIL',
      message: script.error
    }
  const actor = script.SCRIPT_TYPE === 'ACTOR' && script.NOVEL_ACTOR_IDX
    ? await getNovelActor(script.NOVEL_ACTOR_IDX)
    : undefined
  const background = script.NOVEL_PICTURE_IDX
    ? await getNovelBackground(script.NOVEL_PICTURE_IDX)
    : undefined
  const bgm = script.NOVEL_BGM_IDX
    ? await getNovelBGM(script.NOVEL_BGM_IDX)
    : undefined
  const bgs = script.NOVEL_BGS_IDX
    ? await getNovelBGS(script.NOVEL_BGS_IDX)
    : undefined
  const sound = script.NOVEL_SOUND_IDX
    ? await getNovelSound(script.NOVEL_SOUND_IDX)
    : undefined
  ctx.body = {
    status: 'DONE',
    script,
    actor,
    background,
    bgm,
    bgs,
    sound
  }
}

module.exports.getNovelList = async ctx => {
  const count = await getNovelCount()
  const dataSource = await getNovelList(0, 20)
  ctx.body = {
    status: 'DONE',
    count,
    dataSource
  }
}

module.exports.getNovel = async ctx => {
  const {
    idx,
    novel
  } = ctx.state
  const customCSSOptions = novel.IS_USE_CUSTOM_CSS === 1
    ? await getNovelCustomCssOptions(idx)
    : []
  ctx.body = {
    status: 'DONE',
    novel,
    customCSSOptions
  }
}
