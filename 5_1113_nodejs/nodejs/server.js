const http = require('http');

let server=http.createServer(function(request, response){
	console.log('someone requests!');

	//你是一个服务器，你是被人请求的一方
	//request--- input
	console.log(`请求的是 ${request.url}`);
	console.log(`请求的方法是 ${request.method}`);


	//response
	response.write('abcdeee');
	response.write('2222');
	response.end();
});
server.listen(8082);

console.log('listen successes!');
