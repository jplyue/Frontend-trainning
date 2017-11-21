const http = require('http');
const fs = require('fs');
const io = require('socket.io');
const mysql  = require('mysql');
//new
const url = require('url');//解析地址
const regs = require('./libs/regs.js');

/*
** 接口： 
** 用户注册—— /reg?user=xxx&password=xxx
** 			  {"code": 0//成功, "msg":"信息"}
** 用户登录—— /login?user=xxx&password=xxx
**
**
**/


//数据库
let db = mysql.createPool({ host: 'localhost', user:'root', password: 'cctv.com', database: '20171117'});

//2. http 服务器
let httpServer = http.createServer((req, res)=>{
	//req.url=>/reg?user=xxx&password=xxx
	////太麻烦 let [path, str] = req.url.split('?');
	////使用url模块解析
	//// search是?后的，path是数据地址，parse加上true之后，会把一串数据地址变为字符串对象
	let {pathname, query} = url.parse(req.url, true);//query是{ name: ggg, pwd: 123}

	if(pathname=='/reg'){
		//注册接口
		let {user, pass} = query;

		//1. 校验数据
		//前台后台都需要检验，万一禁用了js前台校验就没用，没有前台校验用户体验不好
		if(!regs.username.test(user)){
			//write只接收字符串或Buffer从文件读出来的
			res.write(JSON.stringify({ code: 1, msg: "用户名不符合规范"}));
			res.end();
		}else if(!regs.password.test(pass)){
			res.write(JSON.stringify({code: 2, msg: "密码不符合规范"}));
			res.end();
		}else{
			//2. 检验用户名是否重复
			db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`, (err, data)=>{
				if(err){
					console.log(err)
					res.write(JSON.stringify({ code: 1, msg: "数据库有错"}));
					res.end();
				}else if(data.length > 0){
					res.write(JSON.stringify({ code: 1, msg: "此用户已存在"}));
					res.end();
				}else{
					//3. 插入
					db.query(`INSERT INTO user_table(username, password, online) VALUES('${user}', '${pass}', 0)`, err=>{
						if(err){
							res.write(JSON.stringify({ code: 1, msg: "数据库插入失败"}));
							res.end();
						}else{
							res.write(JSON.stringify({ code: 0, msg: "数据库插入成功"}));
							res.end();
						}
					})
				}
			});
		}
		console.log('请求注册接口', query)
	}else if(pathname == '/login'){
		//登录接口
		console.log('请求登录接口');
				//注册接口
		let {user, pass} = query;

		//1. 校验数据
		if(!regs.username.test(user)){
			//write只接收字符串或Buffer从文件读出来的
			res.write(JSON.stringify({ code: 1, msg: "用户名不符合规范"}));
			res.end();
		}else if(!regs.password.test(pass)){
			res.write(JSON.stringify({code: 2, msg: "密码不符合规范"}));
			res.end();
		}else{
			//2. 检验用户名是否重复
			db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`, (err, data)=>{
				if(err){
					console.log(err)
					res.write(JSON.stringify({ code: 1, msg: "数据库有错"}));
					res.end();
				}else if(data.length == 0){
					res.write(JSON.stringify({ code: 1, msg: "此用户不存在"}));
					res.end();
				}else if(data[0].password != pass){
					res.write(JSON.stringify({ code: 1, msg: "用户名或密码有误"}));
					res.end();
				}else{
					//3.设置状态
					db.query(`UPDATE user_table SET online=1 WHERE ID=${data[0].ID}`, err=>{
						if(err){
							res.write(JSON.stringify({ code: 1, msg: "数据库有错"}));
							res.end();
						}else{
							res.write(JSON.stringify({ code: 0, msg: "登录成功"}));
							res.end();
						}
					})
				}
			});
		}
	}else{
		fs.readFile(`www${req.url}`, (err, data)=>{
			if(err){
				res.writeHeader(404);
				res.write('Not Found');
				res.end();
			}else{
				res.write(data);
				res.end();
			}
		});
	}
});

httpServer.listen(8082);