const koa = require('koa');
const ejs = require('koa-ejs');
const mysql = require('./libs/koa-better-mysql');

let db = mysql.createPool({ host: 'localhost', port: 3306, user:'root', password: 'cctv.com', database: 'an_ju_ke'});


let server = new koa();
server.listen(8000);

/*
** 一般中间件这么用
* server.use(ejs());
** 但是ejs
*/

ejs(server, {
	root: './template',
	layout: false,
	viewExt: 'ejs',
	cache: false,
	debug: true
});

server.use(async ctx=>{
	let houses = await db.query('SELECT * FROM house_table');

	await ctx.render('index', {
		houses
	});
})