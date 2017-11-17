const mysql = require('mysql');

//性能低
//let db = mysql.createConnection({ host: 'localhost', username:'root', password: 'ctvit.com', database: '20171117'});

//默认10个,足够。开太多会导致数据库性能低下

//1. 连接
let db = mysql.createPool({ host: 'localhost', port: 3306, user:'root', password: 'cctv.com', database: '20171117'});

//2. 查询
db.query('SELECT * FROM user_table', (err, data)=>{
	if(err){
		console.log(err);
	}else{
		console.log(data);
	}
});

