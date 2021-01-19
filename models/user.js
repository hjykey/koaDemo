import mongooes from 'mongoose'
const schema = mongooes.Schema

// 实例化数据模板
const UserSchema = new schema(
  {
    //   去掉mongoose自动添加的_id
    // _id:flase
    // 查询时_id:0可以去掉查询中保留的虚拟属性
    //取消__V,
    // versionKey: false
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  }
  // {
    //   定义数据库中的表名称
  //     collections: 'Goods',
  // }
)
export default mongooes.model('users', UserSchema)
