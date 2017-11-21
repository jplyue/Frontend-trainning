//多语言网站
const http = require('http');

let server = http.createServer((req, res) => {
	let lang = req.headers['accept-language'].split(';')[0].split(',')[0];

	switch(lang.toLowerCase()){
		case 'zh-cn': { 
			res.setHeader({ location: 'http://localhost/cn/'})
			res.writeHeader(302);//重定向
		}
	}
});

server.listen(8082);