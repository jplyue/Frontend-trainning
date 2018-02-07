const get = require('./libs/koa-http');
const mysql = require('./libs/koa-better-mysql');
const ejs = require('koa-ejs');
const koa = require('koa');

let db = mysql.createPool({ host: 'localhost', port: 3306, user: 'root', password:'cctv.com', database: 'an_ju_ke'});

let server = new koa();
server.listen(8000);

ejs(server, {
	root: './template',
	layout: false,
	viewExt: 'ejs',
	cache: false,
	debug: true
});

server.use(async ctx=>{
	let buffer = await get('http://localhost/a.php?n1=444&n2=499');

	ctx.response.body = buffer.toString();
})