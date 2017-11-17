const fs = require('fs');

/*fs.readFile('1.txt', (err,data)=>{
	//根据err判断文件读取结果，成功err为null
	if(err){
		console.log('读取文件失败');
	}else{
		console.log('读取成功');
		console.log(data);//Buffer
		console.log(data.toString());//可以转换成字符串
	}
});*/

fs.writeFile('2.txt', "写点什么好呢？", err=>{
	if(err){
		console.log('写入失败！')
	}else{
		console.log('写入成功')
	}
})