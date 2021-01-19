import jwt from 'jsonwebtoken'
//jwt包含三个部分，头部header，payload(载荷)和签名Signature
// 头部{  "alg": "HS256",  "typ": "JWT"}
// 载荷{
//   iss (issuer)：签发人，
//   exp (expiration time)：过期时间，
//  sub (subject)：主题
// aud (audience)：受众
// nbf (Not Before)：生效时间
// iat (Issued At)：签发时间
// jti (JWT ID)：编号}以上为官方字段，可自定义私有字段如{  "sub": "1234567890",  "name": "John Doe",  "admin": true}
const secret = 'jinwandaloahu'
let createToken = (data, expiresIn) => {
  //创建token的方法
  let obj = { expiresIn: { type: Number, default: 1000 * 60 * 60 * 24 * 7 } }
  obj.data = data || {} //存入token的数据
  obj.ctime = new Date().getTime() //token的创建时间
  //设定的过期时间
  if (expiresIn) obj.expiresIn = expiresIn
  let token = jwt.sign(obj, secret)
  return token
}
let varifyToken = (token) => {
  //验证token是否合法的方法
  let result = null
  try {
    let { data, ctime, expiresIn } = jwt.verify(token, secret)
    let nowTime = new Date().getTime()
    if (nowTime - ctime < expiresIn) {
      result = data
    }
  } catch (error) {}
  //console.log(result)
  return result
}

export default { createToken, varifyToken }
