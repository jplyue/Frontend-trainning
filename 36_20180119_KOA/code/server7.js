const koa = require('koa');
const static = require('koa-static');
const router = require('koa-router');
const fs = require('fs');
const my_static = require('./libs/my-static');

let server = new koa();
server.listen(8080);



//2. 静态文件
////必须引用koa-static
//1. 缓存
//2. 压缩
//3. 读取文件
//server.use(static('www'));
server.use(my_static('www'));

server.use(async(ctx)=>{
	//console.log(ctx.request.url);
	//console.log(ctx.request.path);//内容一样

	/*
	** ctx.req，没有扩展的属性，原生的
	** ctx.res，原生
	** ctx.request, 有query，koa封装过的
	** ctx.response，koa封装过的
	*/

	/*let rs = fs.createReadStream(`www${ctx.request.path}`);
	rs.pipe(ctx.res);

	//根据body来显示的
	ctx.response.body = 'xxx';

	rs.on('err', ()=>{
		ctx.res.writeHeader(404);
		ctx.res.write('Not Found');
		ctx.res.end();
	});*/


	////中间件执行完了之后，过了一会，文件才读完。readfile是一个异步操作。
	//await不是万能的，只能与promise, generator, async配合，不能和普通函数配合
	/*await fs.readFile(`www${ctx.request.path}`, (err, data)=>{
		console.log(data)
		ctx.response.body = data;
	});*/


	/*ctx.response.body = await new Promise((resolve, reject) => {
		fs.readFile(`www${ctx.request.path}`, (err, data)=>{
			if(err){
				reject(err);
			}else{
				resolve(data.toString());//图片就毁了，需要针对不同的类型就行配置
			}

			console.log(data.toString())	
			ctx.response.body = data.toString();
		});
	});*/
});

