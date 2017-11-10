function runner(_gen){
	return new Promise((resolve, reject)=>{//生成一个promise对象
		var gen=_gen();//保存传入的函数

		_next();
		function _next(_last_res){
			var res=gen.next(_last_res);//执行第一个yield,res得到{ done:false; value: ajax...}

			if(!res.done){//如果done是false，gen没结束
				var obj=res.value;//保存返回的数据

				if(obj.then){//如果是一个promise请求，ajax请求
					obj.then((res)=>{//执行then
						_next(res);//用next执行下个gen
					}, (err)=>{
						reject(err);//出错的话执行reject
					});
				}else if(typeof obj=='function'){//没有then，不是ajax函数，只是function
					if(obj.constructor.toString().startsWith('function GeneratorFunction()')){//如果是一个generator函数
						runner(obj).then(res=>_next(res), reject);//递归去调用runner
					}else{//不是gen，直接调用obj function
						_next(obj());//否则下一步
					}
				}else{//不是promise，不是func，直接执行
					_next(obj);
				}
			}else{//如果done是true，已结束，
				resolve(res.value);//承诺已实现
			}
		}
	});
}
