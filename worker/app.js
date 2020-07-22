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
    type: 'DC',
    label: '힛갤',
    board: 'hit',
    maxPage: 3,
    timeout: 15000,
    timer: '00 00 * * * *'
})

reserved({
    path: 'dcinside',
    subject: '디시인사이드 - 퍼온유머 갤러리',
    type: 'DC',
    label: '펌유갤',
    board: 'scrap_smile',
    extendedLink: '&exception_mode=recommend',
    maxPage: 3,
    timeout: 15000,
    timer: '00 30 * * * *'
})

// reserved({
//     path: 'fmkorea',
//     subject: '에펨코리아 - 포텐 터짐',
//     type: 'FM',
//     label: '포텐터짐',
//     board: 'best',
//     extendedLink: '&exception_mode=recommend',
//     maxPage: 3,
//     timeout: 15000,
//     timer: '00 45 * * * *'
// })