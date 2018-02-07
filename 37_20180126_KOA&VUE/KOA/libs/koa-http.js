const http = require('http');
const url = require('url');

module.exports = function(str){
	return new Promise(resolve, request){
		let client = http.request(
			url.parse(str)
		, (res)=>{
			let arr = [];
			res.on('data', data=>{
				arr.push(data)
			});//对方给你数据了
			res.on('end', data=>{
				resolve(Buffer.concat(arr));
			});//整个过程结束了
			res.on('error', err=>{
				reject(err)
			});//
		});

		client.end();//准备好了，发送请求
	}
}