import koa from 'Koa'
import Router from 'koa-router'
import mongoose from 'mongoose'
import config from 'config'
import user from './routers/api/user.js'
import profile from './routers/api/profile.js'
import bodyparser from 'koa-bodyparser'
import passport from 'koa-passport'
import session from 'koa-session'
import cors from './util/cors.js'
import passportMidware from './util/passport.js'
//实例化s
const app = new koa()

const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = 'this a koa interfaces！'
})
//配置路由器地址，在localhost:5000/api/users下找
router.use('/api/users', user)
router.use('/api/profiles', profile)

app.use(bodyparser())

// 连接数据库，URL以mongodb:// + [用户名:密码@] +数据库地址[:端口] + 数据库名。（默认端口27017）
// 连接mongodb数据库的链接解析器会在未来移除，要使用新的解析器，通过配置{ useNewUrlParser:true }来连接 ；其他警告参考：https://mongoosejs.com/docs/deprecations.html
mongoose
  .connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // 消除警告Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify`。。。
    // 参考https://mongoosejs.com/docs/deprecations.html#findandmodify
    useFindAndModify: false,
  })
  .then(() => {
    console.log('mongodb connected!')
  })
  .catch((err) => {
    console.log(err)
  })

// 跨域
app.use(cors())

//配置session的中间件
app.keys = ['some secret hurr'] // session加密字段
// 当我们没有写store属性的时候，默认即利用cookie实现session
// or if you prefer all default config, just use => app.use(session(app));
app.use(
  session(
    {
      key: 'koa.sess', //cookie key (default is koa.sess)
      maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
      overwrite: true, //是否可以overwrite    (默认default true)
      httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
      signed: true, //签名默认true
      rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
      renew: false, //(boolean) renew session when session is nearly expired,
    },
    app
  )
)

// 启动验证token
app.use(passport.initialize())
app.use(passport.session())
passportMidware(passport)

//添加路由，use(function),function添加中间件，默认返回this,因此可以链式表达
//等同于app.use(someMiddleware).use(someOtherMiddleware).listen(3000)
app.use(router.routes()).use(router.allowedMethods())
//设置端口号
const port = 5000
//listen()为 new require('http'或'https').creatServer(app.callback()).listen(port)的语法糖
app.listen(port, () => {
  console.log(`serve started on: ${port}`)
})
