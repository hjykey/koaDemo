# 安装的模块
1. package.json的需添加"type": "module"，用于ES，区别commonJS,使用import引入组件时需要添加此属性
2. nodemon是一个监控文本改动自动重启服务器的组件，需要npm install nodemon -s 安装
3. mongodb的云数据库产品mlab，本例未使用。npm  install mongoose模块
4. npm install koa-bodyparser 表单解析中间件
5. npm install bcrypt或者bcryptjs
6. npm install gravatar
7. npm install jsonwebtoken
8. npm install base64url与base64有所不同，Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_ 。这就是 Base64URL 算法
9. npm install koa-passport 和  passport-jwt ，封装了各类验证
10. npm install config
11. koa-router 路由中间件
12. koa-static 静态资源加载中间件
13. js 模板引擎
14. md5 密码加密
15. moment 时间中间件
16. koa-views 模板呈现中间件
17. hai mocha 测试使用
18. koa-static-cache 文件缓存
19. koa-session||koa-session-minimal 处理 `session`
20. npm install validator 密码邮箱等等的验证

----
# CommonJS 和ES6加载的区别
1. .mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置；
2. package.json文件，指明{ type: "module" }或者增加 "exports":{ 
    "require":"./index.js",
    "import":"./esm/wrapper.js" 
}
3. 参考http://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html
4. 一个项目尽量避免混用二者