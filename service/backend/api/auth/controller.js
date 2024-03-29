const request = require('request')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bkfd2Password = require('pbkdf2-password')
const User = require('../../lib/user')
const Crypto = require('../../lib/crypto')
const SendMail = require('../../lib/email')
const Recaptcha = require('../../lib/recaptcha')
const createUser = require('../../database/user/createUser')
const readUser = require('../../database/user/readUser')
const updateUser = require('../../database/user/updateUser')

const hasher = bkfd2Password()

exports.getAuth = async ctx => {
  const {username, password} = ctx.request.body
  if (username === '' || password === '')
    return
  const user = await readUser.auth(username)
  if (!user)
    return ctx.body = {
      message: '존재하지 않는 계정입니다.',
      status: 'fail'
    }
  try {
    const result = await new Promise((resolve, reject) => {
      hasher({
        password,
        salt: user.salt
      }, (err, pass, salt, hash) => {
        if (err)
          return reject({message: err, status: 'fail'})
        if (user.password !== hash)
          return reject({message: '비밀번호가 올바르지 않습니다.', status: 'fail'})
        // if (user.isVerified < 1) return reject({ redirect: 'accept', message: '이메일을
        // 인증하지 않았습니다.', status: 'fail' })
        const token = jwt.sign({
          jti: user.id
        }, process.env.JWT_SECRET, {expiresIn: '30d'})
        resolve({token, status: 'ok'})
      })
    })
    ctx.body = result
  } catch (e) {
    ctx.body = e
  }
}

exports.createUser = async ctx => {
  const {username, nickname, email, authCode, password} = ctx.request.body
  if (username === '' || nickname === '' || email === '' || password === '')
    return //auth 제거
  const getUsername = await readUser.username(username)
  if (getUsername)
    return ctx.body = {
      message: '이미 존재하는 아이디입니다.',
      status: 'fail'
    }
  const getNickname = await readUser.nickname(nickname)
  if (getNickname)
    return ctx.body = {
      message: '이미 존재하는 닉네임입니다.',
      status: 'fail'
    }
  const getEmail = await readUser.email(email)
  if (getEmail)
    return ctx.body = {
      message: '이미 존재하는 이메일입니다.',
      status: 'fail'
    }
  const regex = /^.*(?=.{8,10})(?=.*[a-zA-Z])(?=.*?[A-Z])(?=.*\d)(?=.+?[\W|_])[a-zA-Z0-9!@#$%^&*()-_+={}\|\\\/]+$/gm
  if (!regex.test(password)) {
    return ctx.body = {
      message: '알파벳 대/소문자,숫자,특수문자 포함하여 8글자 이상',
      status: 'fail'
    }
  }
  /*try {
  if (email !== Crypto.decrypt(authCode)) return ctx.body = { message: '인증코드가 올바르지 않습니다.', status: 'fail' }
} catch (e) {
  return ctx.body = { message: '인증코드가 올바르지 않습니다.', status: 'fail' }
}*/
  try {
    const result = await new Promise((resolve, reject) => {
      hasher({
        password
      }, async (err, pass, salt, hash) => {
        if (err)
          return reject({message: err, status: 'fail'})
        await createUser({username, nickname, email, password: hash, salt})
        resolve({status: 'ok'})
      })
    })
    ctx.body = result
  } catch (e) {
    ctx.body = e
  }
}

exports.sendMail = async ctx => {
  const {email} = ctx.request.body
  if (email === '')
    return
  const getEmail = await readUser.email(email)
  if (getEmail)
    return ctx.body = {
      message: '이미 존재하는 이메일입니다.',
      status: 'fail'
    }
  const decrypt = Crypto
    .encrypt(email)
    .replace(/=+/g, '')
  const subject = `[힛갤] 회원가입 인증코드 발송 안내`
  const content = `<p><h1>아이돌보드</h1></p>
    <p><h3>인증코드 : ${decrypt}</h3></p>
    <p>위의 인증코드를 기입해주세요.</p>`
  try {
    await SendMail(email, subject, content)
    ctx.body = {
      status: 'ok'
    }
  } catch (e) {
    ctx.body = {
      message: e.message,
      status: 'fail'
    }
  }
}

exports.getUser = async ctx => {
  const user = ctx.state.user
  ctx.body = {
    user,
    status: 'ok'
  }
}

exports.getKakaoUser = async ctx => {
  const code = ctx.request.query.code
  try {
    const token = await new Promise((resolve, reject) => {
      const url = 'https://kauth.kakao.com/oauth/token'
      const options = {
        grant_type: 'authorization_code',
        client_id: 'aa7f303969993750f8c188c33e241ab2',
        client_secret: '4zPFj0jAityJx4ShIzjywC8RK207mfzj',
        redirect_uri: 'http://localhost:3000/api/auth/kakao',
        code
      }
      request.post(url, {form: options}, (error, response, body) => {
        if (error)
          return reject({message: error, status: 'fail'})
        if (response.statusCode !== 200)
          return reject({message: '알 수 없는 오류', status: 'fail'})
        const data = JSON.parse(body)
        resolve(data.access_token)
      })
    })
    const result = await new Promise((resolve, reject) => {
      const options = {
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
      request.post(options, (error, response, body) => {
        if (error)
          return reject({message: error, status: 'fail'})
        if (response.statusCode !== 200)
          return reject({message: '알 수 없는 오류', status: 'fail'})
        const data = JSON.parse(body)
        resolve(data)
      })
    })
    ctx.body = {
      result,
      status: 'ok'
    }
  } catch (error) {
    console.log(error)
    ctx.body = error
  }
}

exports.updateUserByIsVerified = async ctx => {
  const {username, email, authCode} = ctx.request.body
  if (username === '' || email === '' || authCode === '')
    return
  const getEmail = await readUser.email(email)
  if (getEmail)
    return ctx.body = {
      message: '이미 존재하는 이메일입니다.',
      status: 'fail'
    }
  const user = await readUser.auth(username)
  if (!user)
    return ctx.body = {
      message: '존재하지 않는 계정입니다.',
      status: 'fail'
    }
  if (user.isVerified > 0)
    return ctx.body = {
      message: '이미 이메일이 인증된 계정입니다.',
      status: 'fail'
    }
  try {
    if (email !== Crypto.decrypt(authCode))
      return ctx.body = {
        message: '인증코드가 올바르지 않습니다.',
        status: 'fail'
      }
  } catch (e) {
    return ctx.body = {
      message: '인증코드가 올바르지 않습니다.',
      status: 'fail'
    }
  }
  await updateUser({
    email,
    isVerified: 1
  }, user.id)
  ctx.body = {
    status: 'ok'
  }
}

exports.updateUserByProfileImage = async ctx => {
  const {url} = ctx.request.body
  if (url === '')
    return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const getProfileImageUrl = await readUser.profileImageUrl(user.id)
  if (getProfileImageUrl && getProfileImageUrl !== '')
    fs.unlink(`./profile/${getProfileImageUrl}`, () => {
    })
  await updateUser({
    profileImageUrl: url
  }, user.id)
  ctx.body = {
    status: 'ok'
  }
}

exports.updateUserByBackgroundImage = async ctx => {
  const {url} = ctx.request.body
  if (url === '')
    return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  const getBackgroundImageUrl = await readUser.backgroundImageUrl(user.id)
  if (getBackgroundImageUrl && getBackgroundImageUrl !== '')
    fs.unlink(`./background/${getBackgroundImageUrl}`, () => {
    })
  await updateUser({
    backgroundImageUrl: url
  }, user.id)
  ctx.body = {
    status: 'ok'
  }
}

exports.updateUser = async ctx => {
  let {username, nickname, newPassword, newPassword2, viewImage} = ctx.request.body
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user)
    return
  if (username === '')
    username = user.username
  if (nickname === '')
    nickname = user.nickname
  if (viewImage === '')
    viewImage = 0
  if (username !== user.username) {
    const getUsername = await readUser.username(username)
    if (getUsername)
      return ctx.body = {
        message: '이미 존재하는 ID입니다.',
        status: 'fail'
      }
  }
  if (nickname !== user.nickname) {
    const getNickname = await readUser.nickname(nickname)
    if (getNickname)
      return ctx.body = {
        message: '이미 존재하는 닉네임입니다.',
        status: 'fail'
      }
  }
  const regex = /^.*(?=.{8,10})(?=.*[a-zA-Z])(?=.*?[A-Z])(?=.*\d)(?=.+?[\W|_])[a-zA-Z0-9!@#$%^&*()-_+={}\|\\\/]+$/gm
  if (!regex.test(newPassword) && newPassword !== '') {
    return ctx.body = {
      message: '알파벳 대/소문자,숫자,특수문자 포함하여 8글자 이상',
      status: 'fail'
    }
  }
  if (newPassword !== '' && newPassword2 !== '' && newPassword === newPassword2) {
    const getSalt = await readUser.salt(user.id)
    console.log(getSalt)
    try {
      const result = await new Promise((resolve, reject) => {
        hasher({
          password: newPassword,
          salt: getSalt
        }, async (err, pass, salt, hash) => {
          if (err)
            return reject({message: err, status: 'fail'})
          await updateUser.password(hash, salt, user.id)
          resolve({status: 'ok'})
        })
      })
      return ctx.body = result
    } catch (e) {
      return ctx.body = e
    }
  }
  await updateUser({
    username,
    nickname,
    viewImage
  }, user.id)
  ctx.body = {
    status: 'ok'
  }
}

// module.exports.showRecaptcha = async ctx => {
//     let { token } = await ctx.request.body
//     const ip = await ctx.get('x-real-ip')
//     if (!token)
//         return
//     const res = await Recaptcha.authRecaptcha(token, ip)
//     if (!res)
//         return ctx.body = {
//             status: 'fail'
//         }
//     else
//         ctx.body = {
//             status: 'ok'
//         }
// }
