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
import views from 'koa-views'
import serve from 'koa-static'
// import path from 'path'
// const __dirname = path.resolve(path.dirname(''))
// 在ES6中__dirname和__filename已经不可用，新方法如下
// import { dirname, extname, basename } from 'path'
// import { fileURLToPath, pathToFileURL } from 'url'
// const __dirname = dirname(fileURLToPath(import.meta.url))
// console.log(basename(fileURLToPath(import.meta.url)))
//实例化s
const app = new koa()
// new Router({ prefix: '/api' })
const router = new Router()
// 参见express这个叫做路由级中间件
router.get('/', async (ctx, next) => {
  ctx.body = 'this a koa interfaces！'
  // 后面有router.allowedMethods()中间件，此处的next()可取消
  // await next()
})
//以下是多级路由的用法
// 第一个参数为路由，第二个参数为中间件，第一个参数不写将配置中间件为所有路由
router.use('/api/users', user)
router.use('/api/profiles', profile)

app.use(bodyparser())
//使用static中间件管理静态资源，路由时会先经过static中间件在static文件夹下寻找
app.use(serve('./static'))

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

/**
 * ejs模板引擎的使用（引擎有jade、ejs、nunjucks、art-template等，art-template由鹅厂出品，速度较快）
 * npm install ejs -s
 * npm install koa-views
 * import views form 'koa-views'
 * 使用ejs引擎
 * app.use(views(__dirname,{ extension: 'ejs' }))
 * 用index模板渲染ctx
 * await ctx.render('index')
 */
// app.use(views(__dirname + '/views', {  map: {html: 'ejs',}})) 写法一,对应index.html
app.use(views('views', { extension: 'ejs' }))

router.get('/ejs', async (ctx) => {
  let titleData = '绑定的数据'
  // views组件里规定autoRender默认为true,rander会自动写入ctx.body,
  await ctx.render('index', { title: titleData })
  console.log(ctx.state)
})
//配置一个中间件，里面通过ctx.state传递公共信息到每一个路由
app.use(async (ctx, next) => {
  ctx.state.addPublicMSG = '公共信息'
  await next()
})

//use调用的是一个应用级的中间件，可以匹配所有路由
// 以下为自定义的一个简单中间件
//实现调用路由前打印日期功能
// 不写next（）,后面的中间件将不会执行，如后面的router.routes()和router.allowedMethods()将失效
app.use(async (ctx, next) => {
  console.log(new Date())
  await next()
})
//自定义一个处理get方法的中间件，路由为'/test'，
// 区别于express的写法app.use（path，middleware）
app.use(async (ctx, next) => {
  if (ctx.url === '/test' && ctx.method === 'GET') {
    let html = `
            <h1>Koa2 request post demo</h1>
            <form method="POST"  action="/">
                <p>userName</p>
                <input name="userName" /> <br/>
                <p>age</p>
                <input name="age" /> <br/>
                <p>webSite</p>
                <input name='webSite' /><br/>
                <button type="submit">submit</button>
            </form>
        `
    ctx.body = html
  } else {
    //其它请求显示404页面,koa本身有出错页面，此处可注释掉
    // ctx.body = '<h1>404!</h1>'
  }
  await next()
})

//添加路由，use(function),function添加中间件，默认返回this,因此可以链式表达
//等同于app.use(someMiddleware).use(someOtherMiddleware).listen(3000)
app.use(router.routes()).use(router.allowedMethods())

//设置端口号
const port = 5000
//listen()为 new require('http'或'https').creatServer(app.callback()).listen(port)的语法糖
app.listen(port, () => {
  console.log(`serve started on: ${port}`)
})
