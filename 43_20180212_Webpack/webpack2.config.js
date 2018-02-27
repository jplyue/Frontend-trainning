module.exports = {
	//入口，相当于vue.app
	entry: `./js/3.js`,//当前目录必须加./,或者写成绝对路径${__dirname}/src/2.js
	output: {
		filename: '3.bundle.js',
		path: `${__dirname}/dist/`//目录,必须写成绝对路径
	},

	//模块(插件)
	module: {
		rules:[
			{
				test: /\.(css|cssx)$/i,//正则,哪些文件要使用, 以css或cssx结尾的文件
				use: ['style-loader', 'css-loader']//先用style处理，再用css处理
			}
		]
	}
}