import koa from 'Koa';
import Router from 'koa-router';
import mongoose from 'mongoose';
import db from './config/keys.js';
import user from './routers/api/user.js';
import bodyparser from 'koa-bodyparser'
//实例化
const app = new koa();
const router = new Router()

router.get('/', async ctx => {
    ctx.body = 'this a koa interfaces！'
})
//配置路由器地址，在localhost:5000/api/users下找
router.use('/api/users', user)


// 连接数据库，URL以mongodb:// + [用户名:密码@] +数据库地址[:端口] + 数据库名。（默认端口27017）
// 连接mongodb数据库的链接解析器会在未来移除，要使用新的解析器，通过配置{ useNewUrlParser:true }来连接 ；其他警告参考：https://mongoosejs.com/docs/deprecations.html

mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("mongodb connected!");
}).catch(err => { console.log(err); })

app.use(bodyparser())
//添加路由，use(function),function添加中间件，默认返回this,因此可以链式表达
//等同于app.use(someMiddleware).use(someOtherMiddleware).listen(3000)
app.use(router.routes()).use(router.allowedMethods())
//设置端口号
const port = process.env.PORT || 5000

//listen()为 new require('http'或'https').creatServer(app.callback()).listen(port)的语法糖
app.listen(port, () => {
    console.log(`serve started on: ${port}`)
})