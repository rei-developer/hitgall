const schedule = require('node-schedule')

schedule.scheduleJob('00 00 * * * *', () => {
    const cron = require('./src/crawler/dcinside')
    cron({
        type: 'DC',
        board: 'hit',
        timeout: 15000
    })
})