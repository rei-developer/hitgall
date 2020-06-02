const schedule = require('node-schedule')
const dcinsideHG = require('./src/crawler/dcinside')

// schedule.scheduleJob('00 00 * * * *', () => {
//     dcinsideHG()
// })

dcinsideHG()

// node app