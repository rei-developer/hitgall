const schedule = require('node-schedule')

const reserved = ({ path, subject, type, label, board, extendedLink, maxPage, limitVotes, timeout, timer }) => {
    console.log(`[예약] ${subject} - ${timer}`)
    schedule.scheduleJob(timer, () => {
        // const cron = require(`./src/crawler/${path}`)
        // cron({
        //     type,
        //     label,
        //     board,
        //     extendedLink,
        //     maxPage,
        //     limitVotes,
        //     timeout
        // })
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
    timer: '00 10 * * * *'
})

reserved({
    path: 'fmkorea',
    subject: '에펨코리아 - 포텐 터짐',
    type: 'FM',
    label: '포텐터짐',
    board: 'best',
    extendedLink: '&exception_mode=recommend',
    maxPage: 3,
    timeout: 15000,
    timer: '00 20 * * * *'
})

reserved({
    path: 'dogdrip',
    subject: '개드립 - 개드립',
    type: 'DD',
    label: '개드립',
    board: 'dogdrip',
    extendedLink: '&sort_index=popular',
    maxPage: 3,
    timeout: 15000,
    timer: '00 30 * * * *'
})

reserved({
    path: 'ygosu',
    subject: '와이고수 - 실시간 인기 게시물',
    type: 'YG',
    label: '와이고수',
    board: 'real_article',
    maxPage: 3,
    limitVotes: 20,
    timeout: 15000,
    timer: '00 40 * * * *'
})

// const cron = require(`./src/crawler/fmkorea`)
// cron({
//     type : 'FM',
//     label : '포텐터짐',
//     board : 'best',
//     extendedLink : '&sort_index=popular',
//     maxPage : 3,
//     timeout : 15000
// })



const cron = require(`./src/crawler/ygosu`)
cron({
    type: 'YG',
    label: '와이고수',
    board: 'real_article',
    maxPage: 3,
    limitVotes: 20,
    timeout: 15000
})