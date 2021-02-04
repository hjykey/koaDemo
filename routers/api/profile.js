import Router from 'koa-router'
const router = new Router()
import profiles from '../../models/profile.js'
import passport from 'koa-passport'
import { validateProfile } from '../../util/validator.js'

/**
 * @route get api/profiles/test
 * @desc 测试
 * @access 接口是公开的
 */
router.get('/test', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    meta: { status: 200, msg: '测试连接成功' },
    data: null,
  }
})
/**
 * @route get api/profiles/
 * @desc 个人信息接口
 * @access 接口是私有的
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    const res = await profiles
      .find({ user: ctx.state.user.id })
      .populate('user', ['name', 'avatar'])

    if (res.length > 0) {
      ctx.status = 200
      ctx.body = {
        meta: { status: 200, msg: '查询成功' },
        data: res,
      }
    } else {
      ctx.status = 404
      ctx.body = {
        meta: { status: 404, msg: '当前用户信息为空' },
        data: null,
      }
    }
  }
)
/**
 * @route post api/profiles/
 * @desc 添加和编辑个人信息接口地址
 * @access 接口是私有的
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (ctx) => {
    const { errors, isValid } = validateProfile(ctx.request.body)
    if (!isValid) {
      ctx.status = 400
      ctx.body = { meta: { status: 400, msg: errors }, data: null }
      return
    }
    const profileFields = {}
    profileFields.user = ctx.state.user.id
    profileFields.handle = ctx.request.body.handle
      ? ctx.request.body.handle
      : ''
    profileFields.company = ctx.request.body.company
      ? ctx.request.body.company
      : ''
    profileFields.website = ctx.request.body.website
      ? ctx.request.body.website
      : ''
    profileFields.location = ctx.request.body.location
      ? ctx.request.body.location
      : ''
    profileFields.status = ctx.request.body.status
      ? ctx.request.body.status
      : ''
    // skills数据转换 ''
    if (typeof ctx.request.body.skills !== 'undefined')
      profileFields.skills = ctx.request.body.skills.split(',')
    profileFields.bio = ctx.request.body.bio ? ctx.request.body.bio : ''
    profileFields.githubusename = ctx.request.body.githubusename
      ? ctx.request.body.githubusename
      : ''
    //前端传social时用JSON.stringify(object)
    profileFields.social = ctx.request.body.social
      ? JSON.parse(ctx.request.body.social)
      : {}

    // 查询数据库
    const res = await profiles.find({ user: ctx.state.user.id })
    if (res.length > 0) {
      // update更新
      const profiledUpdate = await profiles.findOneAndUpdate(
        { user: ctx.state.user.id },
        { $set: profileFields },
        { new: true }
      )
      ctx.status = 201
      ctx.body = {
        meta: { status: 201, msg: '更新完成' },
        data: profiledUpdate,
      }
    }
    // insert插入
    else {
      await new profiles(profileFields)
        .save()
        .then((profile) => {
          ctx.status = 201
          ctx.body = {
            meta: { status: 201, msg: '添加成功' },
            data: profile,
          }
        })
        .catch((err) => {
          ctx.status = 500
          ctx.body = { meta: { status: 500, msg: err }, data: null }
        })
    }
  }
)
/**
 * @route get api/profiles/handle?handle=test
 * @desc 通过handle获取个人信息
 * @access 接口是公开的
 */
router.get('/handle', async (ctx) => {
  // console.log(handle)
  const res = await profiles
    .find({ handle: ctx.query.handle })
    .populate('user', ['name', 'avatar'])
  if (res.length < 1) {
    ctx.status = 404
    ctx.body = '未找到该用户信息'
  } else {
    ctx.status = 200
    ctx.body = res[0]
  }
})
export default router.routes()
