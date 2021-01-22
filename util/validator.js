import validator from 'validator'

const isEmpty = (val) => {
  return (
    val == undefined ||
    val === null ||
    (typeof val === 'object' && Object.keys(val).length === 0) ||
    (typeof val === 'string' && val.trim().length === 0)
  )
}
/**
 *
 * @param {*} obj
 */
export function validateRegister (obj) {
  let errors = {}

  obj.name = !isEmpty(obj.name) ? obj.name : ''
  obj.email = !isEmpty(obj.email) ? obj.email : ''
  obj.password = !isEmpty(obj.password) ? obj.password : ''
  obj.password2 = !isEmpty(obj.password2) ? obj.password2 : ''

  if (!validator.isLength(obj.name, { min: 3, max: 30 }))
    errors.name = '名字的长度不能小于3个字符且不能超过30个字符'
  if (validator.isEmpty(obj.name)) errors.name = '名字不能为空'

  if (!validator.isEmail(obj.email)) errors.email = '邮箱不符合规范'
  if (validator.isEmpty(obj.email)) errors.email = '邮箱不能为空'

  if (!validator.isLength(obj.password, { min: 6, max: 20 }))
    errors.password = '密码长度不能小于6个字符且不能超过20个字符'
  if (validator.isEmpty(obj.password)) errors.password = '密码不能为空'
  if (
    !validator.matches(
      obj.password,
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+-@#$%]).{6,20}/g
    )
  )
    errors.password = '密码至少包含1位数字，1个大写字母，1个小写字母和1个特殊符号（“ +-@＃$％”）'

  if (!validator.equals(obj.password, obj.password2))
    errors.password2 = '两次密码输入不一致'
  if (validator.isEmpty(obj.password2)) errors.password2 = '密码不能为空'

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
/**
 *
 * @param {*} obj
 */
export function validateLogin (obj) {
  let errors = {}

  obj.email = !isEmpty(obj.email) ? obj.email : ''
  obj.password = !isEmpty(obj.password) ? obj.password : ''
  
  if (!validator.isEmail(obj.email)) errors.email = '邮箱不符合规范'
  if (validator.isEmpty(obj.email)) errors.email = '邮箱不能为空'

  if (!validator.isLength(obj.password, { min: 6, max: 20 }))
    errors.password = '密码长度不能小于6个字符且不能超过20个字符'
  if (validator.isEmpty(obj.password)) errors.password = '密码不能为空'
  if (
    !validator.matches(
      obj.password,
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+-@#$%]).{6,20}/g
    )
  )
    errors.password = '密码至少包含1位数字，1个大写字母，1个小写字母和1个特殊符号（“ +-@＃$％”）'

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
