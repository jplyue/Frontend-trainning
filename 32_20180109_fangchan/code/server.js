const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const mysql = require('mysql');
const config = require('./config');

//新建服务器
let server = express();
server.listen(config.port);

const db = mysql.createPool({host: config.host, user: config.mysql_user, password: config.mysql_password, database: config.mysql_dbname, port: config.mysql_port });

server.use((req, res, next) => {
	req.db = db;
	next();
});

//中间件
//普通POST数据
server.use(bodyParser.urlencoded({ extended: false }));

//文件POST数据
let multerObj = multer({ dest: './upload/'});
server.use(multerObj.any());

//cookie
server.use(cookieParser(require('./secret/cookie_key')));

//session
server.use(cookieSession({
	keys: require('./secret/session_key')
}));

//模板
server.set('html', consolidate.ejs);
server.set('view engine', 'ejs');
server.set('views', './template/');

//处理请求
server.use('/admin/', require('./routers/admin'));

// let www_router = express.Router();
// server.use('/', www_router);
server.use('/', require('./routers/www'));

//静态文件
server.use(express.static('./www/'));
