const schedule = require('node-schedule')
const dcinsideHG = require('./src/crawler/dcinside/hitgall')

// schedule.scheduleJob('00 * * * * *', () => {
//     dcinsideHG()
// })

dcinsideHG()