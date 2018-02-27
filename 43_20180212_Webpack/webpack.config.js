module.exports = {
	//入口，相当于vue.app
	entry: `./js/2.js`,//当前目录必须加./,或者写成绝对路径${__dirname}/src/2.js
	output: {
		filename: '2.bundle.js',
		path: `${__dirname}/dist/`//目录,必须写成绝对路径
	}
}