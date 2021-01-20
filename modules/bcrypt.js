import bcrypt, { hash } from 'bcrypt'
//加盐
export async function createHash(password) {
  return bcrypt.hashSync(password, 10)
}
//check
export async function checkPassword(loginPassword, storePassword) {
  return bcrypt.compareSync(loginPassword, storePassword)
}
