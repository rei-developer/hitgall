const request = require('request')

exports.sendMessage = async ctx => {
  const user = ctx.state.user
  const text = ctx.request.body.text
  if (!user.id)
    return ctx.body = {status: 'fail', message: 'userId is NULL'}
  if (!text || text === '')
    return ctx.body = {status: 'fail', message: 'text is NULL'}
  const options = {
    url: `https://builder.pingpong.us/api/builder/60114013e4b078d8739bbf64/integration/v0.2/custom/${user.id}`,
    body: {
      request: {
        query: text
      }
    },
    headers: {
      'Authorization': 'Basic a2V5OjA3MTBjMGExNjE5YzIxNWQ0Y2ZmN2ZiNTBmZGNiNDhh',
      'Content-Type': 'application/json'
    },
    json: true
  }
  try {
    ctx.body = await new Promise((resolve, reject) => {
      request.post(options, (error, response, body) => {
        if (error)
          return reject({message: error, status: 'fail'})
        if (response.statusCode !== 200)
          return reject({message: '알 수 없는 오류', status: 'fail'})
        const result = body.response.replies
        resolve({result, status: 'ok'})
      })
    })
  } catch (error) {
    ctx.body = error
  }
}
