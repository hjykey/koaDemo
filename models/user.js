import mongooes from "mongoose";
const schema = mongooes.Schema

// 实例化数据模板
const UserSchema = new schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
}
// {
//     collections: 'Goods',
// }
)
export default mongooes.model('users', UserSchema)