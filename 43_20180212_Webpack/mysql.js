/*
** mysql 事务的使用

1. 官方的
db.beginTransaction(err=>{})
db.commit(err=>{})
db.rollback(err=>{})

2. 自己来
begin
xxx
xxx
commit
**
*/

const mysql = require('mysql');

/**
** 不能使用createPool要使用createConnection
** createPool: 多个连接，挑一个来用
** createConnection: 单一连接，因为提交之前不可以换连接，pool会动不动换连接

如果想要同时使用Pool和Connection的话，使用getConnection: 从Pool里取出一个Connection, 用完之后再还回去

let db = mysql.createPool({})

let conn = db.getConnection();

conn.query();
conn.release();


dbConn.end()
dbPool.end()
*/
let db = mysql.createConnection({ host: 'localhost', port: 3306, user: 'root', password:'cctv.com', database: '20171117'});

db.beginTransaction(err=>{
	if(err){
		console.log('事务开启失败');
	}else{
		db.query('SELECT * FROM user_table', (err, data) => {
			if(err){
				console.log('获取数据失败1');
				db.rollback(()=>{
					console.log('滚回去')
				});
			}else{
				db.query('DELETE FROM use_table', (err, data) => {
					if(err){
						console.log('获取数据失败2');
						db.rollback(()=>{
							console.log('滚回去')
						});
					}else{
						db.commit((err) => {
							if(err){
								console.log('提交失败');
							}else{
								console.log('提交成功');
							}
						})
					}
				});
			}
		})
	}
});