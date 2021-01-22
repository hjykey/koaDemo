import Router from 'koa-router'
const router = new Router()
import profiles from '../../models/profile.js'

/**
 * @route get api/users/profiles
 * @desc 测试
 * @access 接口是公开的
 */
router.get('/profiles', async (ctx) => {
  ctx.status = 200
  ctx.body = {
    meta: { status: 200, msg: '测试连接成功' },
    data: null,
  }
})

export default router.routes()
