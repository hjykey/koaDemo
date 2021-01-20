import Router from 'koa-router'
import gravatar from 'gravatar'
import passport from 'koa-passport'
//从数据模板引入
import user from '../../models/user.js'
import jwt from '../../modules/jwt.js'
import { createHash, checkPassword } from '../../modules/bcrypt.js'
const router = new Router()
/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { msg: 'users works..' }
})
/**
 * @route post api/users/register
 * @desc 用户注册
 * @access 接口是公开的
 */
router.post('/register', async (ctx) => {
  // 通过email查询是否已经注册
  const findResult = await user.find({ email: ctx.request.body.email })
  if (findResult.length > 0) {
    //status码可参考 https://koa.bootcss.com/#links
    ctx.status = 501
    ctx.body = { email: '邮箱已被占用' }
  } else {
    // https://www.npmjs.com/package/gravatar
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    })
    const newUser = new user({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: ctx.request.body.password,
    })
    //密码加盐
    newUser.password = await createHash(ctx.request.body.password)
    //  存储到数据库
    await newUser
      .save()
      .then((user) => {
        ctx.status = 201
      })
      .catch((err) => console.log(err))
  }
})
/**
 * @route post api/users/login
 * @desc 用户登录,返回一个token
 * @access 接口是公开的
 */
router.post('/login', async (ctx) => {
  const findResult = await user.find({ name: ctx.request.body.name })
  if (findResult.length === 0) {
    ctx.response.status = 501
    //response别名系统
    ctx.body = { msg: '用户不存在' }
  } else {
    // console.log(findResult)
    const match = await checkPassword(
      ctx.request.body.password,
      findResult[0].password
    )
    // console.log(match)
    if (match) {
      // 返回token
      const payload = {
        id: findResult[0]._id,
        name: findResult[0].name,
        avatar: findResult[0].avatar,
      }
      //   3600秒后过期
      const token = jwt.createToken(payload, 3600)

      ctx.status = 200
      //   注意Bearer 后的空格
      ctx.body = { msg: '登录成功', token: 'Bearer ' + token }
    } else {
      ctx.status = 400
      ctx.body = { msg: '密码错误' }
    }
  }
})
/**
 * @route get api/users/current
 * @desc 用户信息,登录后显示
 * @access 接口是私密的，token验证
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    console.log(ctx.state.user)
    ctx.body = { sucess: true }
  }
)

export default router.routes()
