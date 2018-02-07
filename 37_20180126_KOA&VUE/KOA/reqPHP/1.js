const http = require('http');

let client = http.request({
	hostname: 'www.baidu.com',
	port: 80,
	path: '/s?wd=abc&rsv_spt=1&rsv_iqid=0xd637d9af00003052&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_sug3=3&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&inputT=741&rsv_sug4=742'//搜索abc时看到的页面
	/*headers: {//根据请求的header判断浏览器，返回的代码不一样
		'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	}*/
}, (res)=>{
	let str = '';

	res.on('data', data=>{
		str += data;
		//console.log('数据来了');
	});//对方给你数据了
	res.on('end', data=>{
		//console.log('请求成功了');
		console.log(str);
	});//整个过程结束了
	res.on('error', err=>{
		console.log('请求出错');
	});//
});

client.end();//准备好了，发送请求