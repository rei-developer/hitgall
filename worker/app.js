const schedule = require('node-schedule')
const readWorker = require('./src/database/worker/read')

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

(async () => {
    const workers = await readWorker()
    workers.map(item => {
        reserved({
            path: item.path,
            subject: item.subject,
            type: item.type,
            label: item.label,
            board: item.board,
            extendedLink: item.extendedLink,
            maxPage: item.maxPage,
            timeout: item.timeout,
            timer: item.timer
        })
    })
    console.log(`I'm working start!!`)
})()

// const cron = require(`./src/crawler/fmkorea`)
// cron({
//     type: 'FM',
//     label: '포텐터짐',
//     board: 'best',
//     extendedLink: '&sort_index=popular',
//     maxPage: 3,
//     timeout: 15000
// })

// const cron = require(`./src/crawler/dcinside`)
// cron({
//     type: 'DC',
//     label: '야갤',
//     board: 'baseball_new9',
//     extendedLink: '&exception_mode=recommend',
//     maxPage: 3,
//     limitVotes: 2000,
//     timeout: 15000
// })

// const cron = require(`./src/crawler/theqoo`)
// cron({
//     type: 'TQ',
//     label: 'HOT',
//     board: 'hot',
//     maxPage: 3,
//     timeout: 5000
// })