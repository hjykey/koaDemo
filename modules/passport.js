import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from 'config'
import mongooes from 'mongoose'
const User = mongooes.model('users')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.get('jwt_config.secretOrKey')
// opts.issuer = 'accounts.examplesoft.com'
// opts.audience = 'yoursite.net'

export default (passport) => {
  //   console.log(passport)
  // 使用passport验证token
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      //   console.log(jwt_payload)
      const user = await User.findById(jwt_payload.data.id)
      if (user) {
        return done(null, user, '未获得授权')
      } else return done(null, false)
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
