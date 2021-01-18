import Router from 'koa-router'
const router=new Router()

//从数据模板引入
import user from '../../models/user.js'


/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test',async ctx=>{
    ctx.status=200
    ctx.body={msg:'users works..'}
    
})

/**
 * @route post api/users/register
 * @desc 用户注册
 * @access 接口是公开的
 */
router.post('/register',async ctx=>{
 const findresult=  await  user.find({email:ctx.request.body.email})

    console.log(ctx);
})

export default router.routes()