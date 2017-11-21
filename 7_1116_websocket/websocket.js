const http = require('http');
const fs = require('fs');
const io = require('socket.io');
const mysql  = require('mysql');
//new
const url = require('url');//解析地址
const regs = require('./libs/regs.js');

//1. 数据库
let db = mysql.createPool({ host: 'localhost', user: 'root', password: 'cctv.com', database: '20171117'});

//2. http连接
let httpServer = http.createServer((req, res) => {
	fs.readFile(`www${req.url}`, (err, data) => {
		if(err){
			res.writeHead(404);
			res.write('Not found');
			res.end();
		}else{ 	
			res.write(data);
			res.end();
		}
	});
});

httpServer.listen(8082);

//3. websocket服务器
let aSock = [];
let wsServer = io.listen(httpServer);
wsServer.on('connection', sock => {
	let cur_username = '';
	let cur_userID = '';	

	aSock.push(sock);
	
	//注册两大事件
	sock.on('reg', (user, pass) => {
		//1. 校验数据
		if(!regs.username.test(user)){
			sock.emit('reg_ret', 1, '用户名不符合规范');
		}else if(!regs.password.test(pass)){
			sock.emit('reg_ret', 1, 'password invalid');
		}else{
			//2. 用户名是否存在
			db.query(`SELECT ID FROM user_table WHERE username='${user}'`, (err, data) => {
				if(err){
					console.log(err);
					sock.emit('reg_ret', 1, '数据库有误');
				}else if(data.length > 0){
					sock.emit('reg_ret', 1, 'user does exist');
				}else{
					//3. 插入
					db.query(`INSERT INTO user_table(username, password, online) VALUES('${user}', '${pass}', 0)`, err=>{
						if(err){
							console.log(err);
							sock.emit('reg_ret', 1, '数据库有误');
						}else{
							sock.emit('reg_ret', 0, 'reg successes');
						}
					});
				}
			});
		}
	});

	sock.on('login', (user, pass) => {
		if(!regs.username.test(user)){
			sock.emit('login_ret', 1, '用户名不符合规范');
		}else if(!regs.password.test(pass)){
			sock.emit('login_ret', 1, '密码不符合规范');
		}else{
			db.query(`SELECT ID,password from user_table WHERE username='${user}'`, (err, data) => {
				if(err){
					console.log(err);
					sock.emit('login_ret', 1, '数据库有错');
				}else if(data.length == 0){
					sock.emit('login_ret', 1, '用户不存在');
				}else if(data[0].password != pass){
					sock.emit('login_ret', 1, '用户名或密码不正确');
				}else{
					db.query(`UPDATE user_table SET online=1 WHERE ID='${data[0].ID}'`, err=>{
						if(err){
							console.log(err);
							sock.emit('login_ret', 1, '数据库有错');
						}else{
							sock.emit('login_ret', 0, '登录成功');
							cur_username = user;
							cur_userID = data[0].ID;
						}
					})
					
				}
			});
		}
	});

	sock.on('disconnect', function(){
		db.query(`UPDATE user_table SET online=0 WHERE ID=${cur_userID}`, err=>{
			if(err){
				console.log(err);
			}
			
			cur_username= '';
			cur_userID = '';

			aSock = aSock.filter(item=>item!=sock);
		});
	});

	/*
	* 'msg', txt   ===> 'msg_ret', code, msg
	*              ===> broadcase 'msg', name,txt
	*
	*
	**/
	sock.on('msg', (name, txt) => {
		if(!txt){
			sock.emit('msg_ret', 1, '消息文本不能为空');
		}else{
			//广播给所有人
			//socketio 有广播，此处没使用
			aSock.forEach(item => {
				if(item==sock) return;//你发言，不需要接收消息

				item.emit('msg', name, txt);
			});

			sock.emit('msg_ret', 0, '发送成功');
		}
	})
});



