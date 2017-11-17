const http = require('http');
const fs = require('fs');

let server = http.createServer((req, res)=>{
	/**
	* req.url => /a.html    => www/a.html
	* req.url => /aaa/bbb/1.html    => www/aaa/bbb/1.html
	*/

	//此时write和end异步了，因为fs是异步操作
	/*fs.readFile(`www${req.url}`, (err, data)=>{
		if(err){
			res.write(404);
		}else{
			res.write(data);
		}
	});

	res.end();*/

	fs.readFile(`www${req.url}`, (err, data)=>{
		if(err){
			//write的是body，浏览器以为找到了文件，所以不应该发内容
			//res.write(404);
			res.writeHeader(404);
			//res.write('<h1>Not Found</h1>');
			fs.readFile(`http_error/404.html`, (err, data)=>{
				if(err){
					console.log('读取错误')
				}else{
					res.write(data);
					res.end();
				}
			})
		}else{
			res.write(data);
			res.end();
		}
	});
});

server.listen(8082);