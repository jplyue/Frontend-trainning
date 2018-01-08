const express = require('express');
const config = require('../config');
const common = require('../libs/common');

let router = express.Router();
module.exports = router;

//进入所有的admin之前都要校验用户身份，如果没有登录，滚去登录
//所有的，除了/admin/login/
//1. use 所有方法都要过我
//2. 我连路径都没有，所有路径通吃
//3. 我在最前面，所有东西在我后面
router.use((req,res,next)=>{
	//成功登录后就会设置admin_ID
	if(!req.session['admin_ID'] && req.url != '/login'){
		res.redirect('/admin/login');
	}else{//登录了
		next();
	}
});

//  /admin/login

////get是展现login页面，url直接访问
router.get('/login', (req,res)=>{
	//静态文件放在www里，html改为ejs放在template里面
	//因为设置过views会在template里面找
	res.render('login', {error_msg:''});
});

//提交登录请求，form提交
router.post('/login', (req,res)=>{
	let {username, password} = req.body;
	let success = false;

	//判断两次
	if(username== config.root_username){
		if(common.md5(password) == config.root_password){
			console.log('超级管理员已登录');
			req.session['admin_ID'] = 1;	//普通管理员都有id, 32位
			res.redirect('/admin/');
			success = true;
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
					req.session['admin_ID'] = data[0].ID;
					console.log('普通管理员登录成功');
					res.redirect('/admin/');
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
		res.render('login', {error_msg:msg});
	}
});

router.get('/', (req, res)=>{
	res.redirect('/admin/house');
});

router.get('/house', (req, res)=>{
	req.db.query('SELECT ID,title,ave_price,tel FROM house_table', (err, data) => {
		if(err){
			res.sendStatus(500);
		}else{
			res.render('index', {data});
		}
	});
});

router.get('/aaa', (req, res)=>{
	res.send('ok');
	res.end();
});
