const schedule = require('node-schedule')

const reserved = ({ subject, type, board, timeout, timer }) => {
    console.log(`[예약] ${subject} - ${timer}`)
    schedule.scheduleJob(timer, () => {
        const cron = require('./src/crawler/dcinside')
        cron({ type, board, timeout })
    })
}

reserved({
    subject: '디시인사이드 - HIT 갤러리',
    type: 'DC',
    board: 'hit',
    timeout: 15000,
    timer: '00 00 * * * *'
})