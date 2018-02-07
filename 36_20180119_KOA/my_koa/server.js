const koa = require('my-koa');

let server = new koa();
server.listen(8080);

/**typeof
***server.use(function(){});			function
***server.use(* function(){});			function
**/

/**constructor
***server.use(function(){});			Function
***server.use(* function(){});			GeneratorFunction
***server.use(async function(){});			ASyncFunction
**/
server.use(async function (ctx, next){
	console.log('a');

	await next();

	console.log('b');

});

server.use(async (ctx, next) => {
	console.log('1111');
});