import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from 'config'
import mongooes from 'mongoose'
const User = mongooes.model('users')
var opts = {}
//设置抽取token方式为从header里抽取
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.get('jwt_config.secretOrKey')
// opts.ignoreExpiration = true
// opts.issuer = 'accounts.examplesoft.com' //发布者，在jwt里面已经设置，此处不验证
// opts.audience = 'yoursite.net' //订阅者

export default (passport) => {
  //   console.log(passport)
  // 使用passport验证token
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      // console.log(opts)
      const user = await User.findById(jwt_payload.data.id)
      if (user) {
        return done(null, user, '找到用户')
      } else return done(null, false, '用户不存在')
      //   User.findOne({ id: jwt_payload.sub }, function (err, user) {
      //     if (err) {
      //       return done(err, false)
      //     }
      //     if (user) {
      //       return done(null, user)
      //     } else {
      //       return done(null, false)
      //       // or you could create a new account
      //     }
      //   })
    })
  )
}
