const schedule = require('node-schedule')
const dcinsideHG = require('./src/crawler/dcinside/hitgall')

// schedule.scheduleJob('00 * * * * *', () => {
//     await dcinsideHG()
// })

await dcinsideHG()