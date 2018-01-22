const koa = require('koa');
const static = require('koa-static');
const router = require('koa-router');

let server = new koa();
server.listen(8080);

//1. 接口
server.use(async(ctx, next)=>{
	let start = new Date().getTime();

	await next();

	console.log(`页面处理时间：${new Date().getTime()-start}ms`);
});


//我在最上面，底下的一步还是n步都在next里
server.use(async(ctx, next)=>{
	try{
		await next();
	}catch(e){
		//e.name  'Reference Error'
		ctx.response.body = '404';
	}
});



//2. 静态文件
////必须引用koa-static
server.use(static('www'));

