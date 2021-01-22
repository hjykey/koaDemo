import Router from 'koa-router'
import gravatar from 'gravatar'
import passport from 'koa-passport'
//从数据模板引入
import user from '../../models/user.js'
import jwt from '../../util/jwt.js'
import { createHash, checkPassword } from '../../util/bcrypt.js'
import { validateRegister, validateLogin } from '../../util/validator.js'

const router = new Router()
/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = { meta: { status: 200, msg: '测试连接成功' }, data: null }
})
/**
 * @route post api/users/register
 * @desc 用户注册
 * @access 接口是公开的
 */
router.post('/register', async (ctx) => {
  // 验证表单数据
  const { errors, isValid } = validateRegister(ctx.request.body)
  if (!isValid) {
    ctx.status = 400
    ctx.body = { meta: { status: 400, msg: errors }, data: null }
    return
  }
  // 通过email查询是否已经注册
  const findResult = await user.find({ email: ctx.request.body.email })
  if (findResult.length > 0) {
    //status码可参考 https://koa.bootcss.com/#links
    ctx.status = 501
    ctx.body = { meta: { status: 501, msg: '邮箱已被占用' }, data: null }
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
        ctx.body = { meta: { status: 201, msg: '注册成功' }, data: user }
      })
      .catch((err) => {
        console.log(err)
        ctx.status = 500
        ctx.body = { meta: { status: 500, msg: '注册失败' }, data: null }
      })
  }
})
/**
 * @route post api/users/login
 * @desc 用户登录,返回一个token
 * @access 接口是公开的
 */
router.post('/login', async (ctx) => {
  // console.log(ctx.session);
  // 验证表单数据
  const { errors, isValid } = validateLogin(ctx.request.body)
  if (!isValid) {
    ctx.status = 400
    ctx.body = { meta: { status: 400, msg: errors }, data: null }
    return
  }
  const findResult = await user.find({ name: ctx.request.body.name })
  if (findResult.length === 0) {
    ctx.response.status = 400
    //response别名系统
    ctx.body = {
      meta: { status: 400, msg: '用户不存在' },
      data: null,
    }
  } else {
    const match = await checkPassword(
      ctx.request.body.password,
      findResult[0].password
    )
    if (match) {
      const payload = {
        id: findResult[0]._id,
        name: findResult[0].name,
        avatar: findResult[0].avatar,
      }
      //   生成token ，该token 3600秒后过期
      const token = jwt.createToken(payload, 3600)
      ctx.status = 200
      //   发送token到前端，注意Bearer 后的空格，前端可将此token附加到headers的authorization字段下
      ctx.body = {
        meta: { status: 200, msg: '登录成功' },
        data: { user: findResult[0], token: 'Bearer ' + token },
      }
    } else {
      ctx.status = 400
      ctx.body = {
        meta: { status: 400, msg: '密码错误' },
        data: null,
      }
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
    const res = {
      meta: { status: 200, msg: '查询成功' },
      data: {
        id: ctx.state.user._id,
        name: ctx.state.user.name,
        avatar: ctx.state.user.avatar,
        date: ctx.state.user.date,
      },
    }
    ctx.body = res
  }
)

export default router.routes()
