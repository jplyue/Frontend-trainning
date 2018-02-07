const koa = require('koa');
const mysql = require('koa-mysql');
const convert = require('koa-convert');

const db = mysql.createPool({host: 'localhost', port:3306, user:'root', password: 'cctv.com', database: 'an_ju_ke'});

let server = new koa();
server.listen(8000);


server.use(async ctx=>{
	/*
	** koa的中间件好多都没有升级，停留在* generator阶段,需要convert转换
	** 之前的body() --> function *()
	** convert(body()) --> Promoise对象
	
		let datas = await convert(db.query)('SELECT * FROM house_table');
	*/

	let p = new Promise((resolve, reject) => {
		let fn = db.query('SELECT * FROM house_table');

		fn(function(){
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		});
	});

	let datas = await p;
	console.log (datas);
	ctx.response.body = datas;
});