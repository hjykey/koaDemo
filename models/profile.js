import mongooes from 'mongoose'
const schema = mongooes.Schema

// 实例化数据模板
const profileSchema = new schema(
  {
    //   去掉mongoose自动添加的_id
    // _id:flase
    // 查询时_id:0可以去掉查询中保留的虚拟属性
    //取消__V,
    // versionKey: false
    user: {
      type: String,
      ref: 'users', //关联users表
      required: true,
    },
    handle: {
      type: String,
      required: true,
      max: 40,
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    skills: { type: [String], required: true },
    bio: {
      type: String,
    },
    githubusename: {
      type: String,
    },
    experience: {
      type: [
        {
          current: { type: Boolean, default: true },
          title: { type: String, required: true },
          company: { type: String, required: true },
          location: { type: String },
          from: { type: String, required: true },
          to: { type: String },
          description: { type: String },
        },
      ],
    },
    education: {
      type: [
        {
          current: { type: Boolean, default: false },
          school: { type: String, required: true },
          degree: { type: String, required: true },
          fieldofstudy: { type: String },
          from: { type: String, required: true },
          to: { type: String },
          description: { type: String },
        },
      ],
    },
    social: {
      wechat: {
        type: String,
      },
      QQ: {
        type: String,
      },
      tengxunkt: {
        type: String,
      },
      wangyikt: {
        type: String,
      },
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
export default mongooes.model('profiles', profileSchema)
