//DB Connection
const consola = require('consola');
var mongoose = require("mongoose");

const autoIncrement = require('mongoose-auto-increment');

//mongoose Promise
mongoose.Promise = global.Promise;
//mongoose
exports.mongoose = mongoose;

//connect 
exports.connect = () =>{

    console.log("数据库连接地址:mongodb://127.0.0.1:27017/movie");

    //连接数据库
    mongoose.connect("mongodb://127.0.0.1:27017/movie",{
        useCreateIndex: true,
		useNewUrlParser: true,
		promiseLibrary: global.Promise
    })

    //连接错误
    mongoose.connection.on('error',error=>{
        consola.warn('数据库连接失败!',error)
    })

    //连接成功
    mongoose.connection.once('open',()=>{
        consola.ready('数据库连接成功!')
    })

    //自增ID初始化
    autoIncrement.initialize(mongoose.connection);

    //返回实例
    return mongoose;

}
