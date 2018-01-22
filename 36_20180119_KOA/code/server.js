const koa = require('koa');
const static = require('koa-static');
const route = require('koa-route');

let server = new koa();
server.listen(8080);

//1. 接口
//注册: /reg?user=xxx&pass=xxx
// server.use(route.get('/reg/:user/:pass', async (ctx, username, pass, next)=>{
// 	//ctv=> 上下文
// 	ctx.req
// 	ctx.res

// 	ctx.request
// 	ctx.response
	
// 	//ctx.request.body 读过来的body
// 	//ctx.response.body = 'abc';//响应的body
// 	console.log(user,pass)
// }));

server.use(route.get('/reg', async (ctx, next) => {
	console.log(ctx.request.query);	// {'user': 'blue', 'pass': '123456'}

}));


//2. 静态文件
////必须引用koa-static
server.use(static('www'));

