module.exports = {
	//入口，相当于vue.app
	entry: `./js/4.js`,//当前目录必须加./,或者写成绝对路径${__dirname}/src/2.js
	output: {
		filename: '4.bundle.js',
		path: `${__dirname}/dist/`//目录,必须写成绝对路径
	},
	/**
	** 自动css中的bg的url路径指向dist目录
	** 
	*/
	devServer: {
		contentBase: './dist/'//文件查找的目录
	},

	//模块(插件)
	module: {
		rules:[
			{
				test: /\.(css|cssx)$/i,//正则,哪些文件要使用, 以css或cssx结尾的文件
				use: ['style-loader', 'css-loader']//先用style处理，再用css处理
			},
			{
				test: /\.(jpg|png|jpeg|gif|tif|psd|ico)$/i,
				use:['file-loader']
			}
		]
	}
}