const fs = require('fs');
const assert = require('assert');


module.exports = (root)=>{
	assert(root, 'argument 1: root is required');
	assert(typeof root=='string', 'root must be a string');

	return async(ctx)=>{
		ctx.response.body = await new Promise((resolve, reject) => {
			fs.readFile(`www${ctx.request.path}`, (err, data)=>{
				if(err){
					reject(err);
				}else{
					resolve(data.toString());//图片就毁了，需要针对不同的类型就行配置
				}

				console.log(data.toString())	
				ctx.response.body = data.toString();
			});
		});
	}
}