const dcinsideHG = require('./src/crawler/dcinside/hitgall')

const start = async () => {
    const success = await dcinsideHG()
    if (!success)
        console.log('failed')
    console.log('finish')
}

start()