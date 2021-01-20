import cors from 'koa2-cors'

let allowUrl = ['/api/users'] //允许跨域的地址

//将cors()暴露出去给app.js使用
export default function () {
  return cors({
    origin: function (ctx) {
      let url =
        ctx.url.indexOf('?') >= 0
          ? ctx.url.slice(0, ctx.url.indexOf('?'))
          : ctx.url
      if (url.indexOf(allowUrl) >= 0)
        //   return 'http://localhost:8080'; / 这样就能只允许 http://localhost:8080 这个域名的请求了
        return '*'
      // 允许来自所有域名请求
      else return false
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
}
