const koa = require('koa');
const mysql = require('./libs/koa-better-mysql');

const db = mysql.createPool({host: 'localhost', port:3306, user:'root', password: 'cctv.com', database: 'an_ju_ke'})

let server = new koa();
server.listen(8000);


server.use(async ctx=>{
	let datas = await db.query('SELECT * FROM house_table');
	console.log (datas);

	ctx.response.body = datas;
});