import jwt from 'jsonwebtoken'
import config from 'config'

//jwt包含三个部分，头部header，payload(载荷)和签名Signature
// 头部{ algorithms算法- "alg": "HS256" ,  令牌的类型-"typ": "JWT"}
// 载荷{
//   iss (issuer)：签发人，
//   exp (expiration time)：过期时间，//expiresIn
//  sub (subject)：主题 //subject: 主题
// aud (audience)：受众
// nbf (Not Before)：生效时间，在此之前不可用 //notBefore
// iat (Issued At)：签发时间
// jti (JWT ID)：编号}以上为官方字段，可自定义私有字段如{  "sub": "1234567890",  "name": "John Doe",  "admin": true} //jwtid: 令牌id
// 请记住exp，nbf，iat是NumericDate类型。
let createToken = (payload, expiresIn) => {
  //创建token的方法
  let obj = {
    exp: {
      type: Number,
      default:
        Math.floor(Date.now() / 1000) + config.get('jwt_config.expiresIn'),
    },
  }
  obj.data = payload || {} //存入token的数据
  // obj.nbf = new Date().getTime() //token的创建时间
  //有传递的过期时间，则设定的过期时间，没有则使用默认时间
  if (expiresIn) obj.exp = Math.floor(Date.now() / 1000) + expiresIn
  let token = jwt.sign(obj, config.get('jwt_config.secretOrKey'))
  // 在expiresIn，notBefore，audience，subject，issuer没有默认值时。也可以直接在payload中用exp，nbf，aud，sub和iss分别表示
  // let token = jwt.sign(obj, config.get('jwt_config.secretOrKey'), {
  //   expiresIn: expiresIn,
  // })
  return token
}
// token验证,本项目中使用了passport-jwt模块，本方法未使用
let verifyToken = (token) => {
  //验证token是否合法的方法
  let result = null
  try {
    let { data, ctime, expiresIn } = jwt.verify(
      token,
      config.get('jwt_config.secretOrKey')
    )
    let nowTime = new Date().getTime()
    if (nowTime - ctime < expiresIn) {
      result = data
    }
  } catch (error) {
    console.log(error)
  }
  //console.log(result)
  return result
}

export default { createToken, verifyToken }
