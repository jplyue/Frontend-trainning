//resolve 路径拼接功能

const path = require('path');

console.log(path.resolve('/user/root', './aaa')); //解析为/user/root/aaa

console.log(path.resolve('/user/root', './aaa', '../../bbb')); //解析为/user/bbb

console.log(path.resolve(__dirname, 'src/1.js')); //解析为webpack/src/1.js
