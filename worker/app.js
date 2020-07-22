const schedule = require('node-schedule')

const reserved = ({ path, subject, type, label, board, extendedLink, maxPage, timeout, timer }) => {
    console.log(`[예약] ${subject} - ${timer}`)
    schedule.scheduleJob(timer, () => {
        const cron = require(`./src/crawler/${path}`)
        cron({
            type,
            label,
            board,
            extendedLink,
            maxPage,
            timeout
        })
    })
}

reserved({
    path: 'dcinside',
    subject: '디시인사이드 - HIT 갤러리',
    type: '디시',
    label: '힛갤',
    board: 'hit',
    maxPage: 3,
    timeout: 15000,
    timer: '00 00 * * * *'
})

reserved({
    path: 'dcinside',
    subject: '디시인사이드 - 퍼온유머 갤러리',
    type: '디시',
    label: '펌유갤',
    board: 'scrap_smile',
    extendedLink: '&exception_mode=recommend',
    maxPage: 3,
    timeout: 15000,
    timer: '00 30 * * * *'
})

// const cron = require(`./src/crawler/fmkorea`)
// cron({
//     type: '펨코',
//     label: '포텐터짐',
//     board: 'best',
//     extendedLink: '',
//     maxPage: 3,
//     timeout: 15000
// })