const express = require('express');
const config = require('../config');
const common = require('../libs/common');
const fs = require('fs');

let router = express.Router();
module.exports = router;

//进入所有的admin之前都要校验用户身份，如果没有登录，滚去登录
//所有的，除了/admin/login/
//1. use 所有方法都要过我
//2. 我连路径都没有，所有路径通吃
//3. 我在最前面，所有东西在我后面
router.use((req,res,next)=>{
	//不检查session，检查的是cookie
	//将req.url 改为req.path, 加上ref后，url读取的是整个url
	if(!req.cookies['admin_token'] && req.path != '/login'){//如果没登陆，并且不是login
		res.redirect(`/admin/login?ref=${req.url}`);
	}else if(req.path == '/login'){// 访问的是login
		next();
	}else{//登录了
		req.db.query(`SELECT * FROM admin_token_table WHERE ID='${req.cookies['admin_token']}'`, (err, data)=>{
			if(err){
				console.log(err)
				res.sendStatus(500);
			}else if(data[0].length == 0){//token无效
				res.redirect(`/admin/login?ref=${req.url}`);//重新登陆
			}else{
				req.admin_ID = data[0]['admin_ID'];
				next();
			}
		});
	}
});

//  /admin/login

////get是展现login页面，url直接访问
router.get('/login', (req,res)=>{
	//静态文件放在www里，html改为ejs放在template里面
	//因为设置过views会在template里面找
	res.render('login', {error_msg:'', ref: req.query['ref']|| ''});
});

//提交登录请求，form提交
router.post('/login', (req,res)=>{
	let {username, password} = req.body;
	let success = false;

	function setToken(id){
		let ID = common.uuid();
		let oDate = new Date();
		oDate.setMinutes(oDate.getMinutes()+20);
		let t = Math.floor(oDate.getTime()/1000);

		req.db.query(`INSERT INTO admin_token_table (ID, admin_ID, expires) VALUES('${ID}', '${id}', ${t})`, err=>{
			if(err){
				console.log(err)
				res.sendStatus(500);
			}else{
				res.cookie('admin_token', ID);//没有设置有效期，关掉浏览器后cookie过期

				let ref = req.query['ref'];
				if(!ref) ref='';

				res.redirect('/admin'+ ref);
			}
		});
		success = true;
	}

	//判断两次
	if(username== config.root_username){
		if(common.md5(password) == config.root_password){
			console.log('超级管理员已登录');
			setToken(1);
		}else{
			console.log('超级管理员登陆失败');
			showError('用户名或密码错误');
		}
	}else{
		req.db.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data)=>{
			if(err){
				console.log(err)
				showError('数据库出错，请稍后重试');
			}else if(data.length==0){
				console.log('普通管理员不存在');
				showError('用户名或密码有误');
			}else{
				if(data[0].password==common.md5(password)){
					setToken(req.cookies['admin_ID']);
					success = true;
				}else{
					showError('用户名或密码有误');
				}
			}
		})

	}

	//db查询是一个异步操作，此处的错误提示没有意义
	// if(!success){
	// 	res.render('login', {error_msg});
	// }

	function showError(msg){
		res.render('login', {error_msg:msg, ref: req.query['ref']|| ''});
	}
});

router.get('/', (req, res)=>{
	res.redirect('/admin/house');
});

//获取
router.get('/house', (req, res)=>{
	req.db.query('SELECT ID,title,ave_price,tel FROM house_table', (err, data) => {
		if(err){
			res.sendStatus(500);
		}else{
			res.render('index', {data});
		}
	});
});

//添加
router.post('/house', (req, res)=>{
	//console.log(req.body);
	//console.log(req.files);

	//时间
	req.body['sale_time'] = Math.floor(new Date(req.body['sale_time']).getTime()/1000);
	req.body['submit_time'] = Math.floor(new Date(req.body['submit_time']).getTime()/1000);

	//文件
	let aImgPath = [];
	let aImgRealPath = [];
	for(let i=0; i<req.files.length; i++){
		///////!!!!!!!!!!注意这里的filedname
		switch(req.files[i].fieldname){
			case 'main_img':{
				req.body['main_img_path'] = req.files[i].filename;
				/////sql语句中的符号都自带\，所以要\\才能显示\
				req.body['main_img_real_path'] = req.files[i].path.replace(/\\/g, '\\\\');
				break;
			}
			case 'img':{
				aImgPath.push(req.files[i].filename);
				aImgRealPath.push(req.files[i].path.replace(/\\/g, '\\\\'));
				break;
			}
			case 'property_img':{
				req.body['property_img_paths'] = req.files[i].filename;
				req.body['property_img_real_paths'] = req.files[i].path.replace(/\\/g,'\\\\');
				break;
			}
		}
	}

	req.body['ID'] = common.uuid();
	req.body['admin_ID'] = req['admin_ID'];
	req.body['img_paths'] = aImgPath.join(',');
	req.body['img_real_paths'] = aImgRealPath.join(',');

	let arrField = [];
	let arrValue = [];

	for(let name in req.body){
		arrField.push(name);
		arrValue.push(req.body[name]);
	}

	let sql = `INSERT INTO house_table (${arrField.join(',')}) VALUES ('${arrValue.join("','")}')`;

	req.db.query(sql, err=>{
		if(err){
			console.log(err);
			res.sendStatus(500);
		}else{
			res.redirect('/admin/house');////此时重定向变为get请求，来显示数据
		}
	})
});

//删除
router.get('/house/delete', (req, res)=>{
	let ID = req.query['id'];

	let aID = ID.split(',');

	//校验ID，服务器最好校验下数据
	//全是数字字母，字母只到F
	let b_err=false;
	aID.forEach(item=>{
		if(/^(\d[a-f]){32}$/.test(item){
			b_err=true;
		});
	});	

	if(b_err){
		res.sendStatus(400);//数据有问题
	}else{
		//用硬循环不好，因为服务器会一直在相应你的请求，不干别的
		//如果一个服务器只服务一个用户，那循环没关系
		//如果一个服务器给上千个提供服务，用next串行，每个用户串行，所有用户加在一起就是并行的。
		let id_index = 0; 

		_next();
		function _next(){
			let ID = aID[id_index++];

			req.db.query(`SELECT * FROM house_table WHERE ID='${ID}'`, (err,data)=>{
				if(err){//任何一次报错都会走500/404
					console.log(err);
					res.sendStatus(500);
				}else if(data.length ==0){
					res.sendStatus(404, 'no this data');
				}else{
					let arr = [];
					//main_img_real_path

					//img_real_paths

					//property_img_real_paths
					arr.push(data[0]['main_img_real_path']);
					data[0]['img_real_paths'].split(',').forEach(item=>{
						arr.push(item);
					});
					data[0]['property_img_real_paths'].split(',').forEach(item=>{
						arr.push(item);
					});

					//删除方法: rm和unlink
					let i = 0;
					next();
					function next(){
						fs.unlink(arr[i], err=>{
							if(err){
								res.sendStatus(500);
								console.log(err);
							}else{
								i++;

								if(i>=arr.length){
									//删除文字完事
									//2. 删除数据本身
									req.db.query(`DELETE FROM house_table WHERE ID='${ID}'`, err=>{
										if(err){
											console.log(err);
											res.sendStatus(500);
										}else{
											//res.redirect('/admin/house');
										}
									})
								}else{
									next();
								}
							}
						});
					}
				}
			});

			if(id_index < aID.length){
				_next();
			}else{//跳转house列表
				res.redirect('/admin/house');
			}
		}
	}
	//1. 删除相关联的图片

	//2. 删除图片本身
});

//这样也可以，也是RESTful，遵循系统的方式
/////router.delete('/house', (req, res)=>{

//修改
router.get('/house/modify', (req, res)=>{

});

