// const schedule = require('node-schedule')

// schedule.scheduleJob('00 00 05 * * *', () => {
//     const cron = require('./src/crawler/dcinside')
//     cron({
//         type: 'DC',
//         label: 'hit',
//         page: 0,
//         maxPage: 1
//     })
// })

const cron = require('./src/crawler/dcinside')
cron()