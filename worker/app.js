(() => {
  const schedule = require('node-schedule')
  const Worker = require('./src/Worker')
  const DOMAIN = 'https://torrentsee46.com'
  const TIMEOUT = 3000
  const BOARD_LIST = require('./board-list')
  global.isRunning = false
  // const boardList = BOARD_LIST.sort(() => Math.random() - Math.random())
  new Worker(DOMAIN, TIMEOUT, BOARD_LIST)
  schedule.scheduleJob('0 0 */4 * * *', () => {
    if (!global.isRunning)
      new Worker(DOMAIN, TIMEOUT, BOARD_LIST)
  })
})()

/*
const {getSaveList} = require('./src/database/save/read')
const {putSaveImage} = require('./src/database/save/create')

const putImage = async () => {
    const data = await getSaveList()
    data.map(item => {
        const content = item.content
        const match = content.match(/\[img src=\"\/img\/(.*?)\.(.*?)\"\]/g)
        if (match) {
            match.map(async (i, imageIdx) => {
                const saveIdx = item.idx
                const uuid = i
                    .replace(/\[img src=\"\/img\//g, '')
                    .replace(/\.(.*?)\"\]/g, '')
                await putSaveImage({
                    saveIdx,
                    imageIdx,
                    uuid
                })
                console.info(`${item.title} - ${uuid}`)
            })
        }
    })
}

putImage()
*/
