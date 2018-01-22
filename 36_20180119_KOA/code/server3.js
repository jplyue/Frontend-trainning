const koa = require('koa');
const static = require('koa-static');
const router = require('koa-router');

let server = new koa();
server.listen(8080);

//1. 接口

let r1 = router();
server.use(r1.routes());

//http://localhost:8080/a/1/2
r1.get('/a/:id/:page', async(ctx, next) => {
	console.log(ctx.params);

	ctx.response.body = 'abc';
});

r1.get('/b', async(ctx, next) => {
	ctx.response.body = 'ddd';
});


//2. 静态文件
////必须引用koa-static
server.use(static('www'));

