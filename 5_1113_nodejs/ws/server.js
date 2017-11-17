const http = require('http');
const io = require('socket.io');

//1.http服务
const httpServer = http.createServer(()=>{
	//在这里会对请求进行判断
		/*if(url === '/socket.io/socket.io.js'){

		else{

		}*/
	}
});
httpServer.listen(8082);

//2.ws服务
const wsServer = io.listen(httpServer);
wsServer.on('connention', sock=>{
	/*与客户端相同的名字，接收的参数*/
	sock.on('a', function(n1, n2, n3, n4, n5){
		console.log(n1, n2, n3, n4, n5);
	});
});