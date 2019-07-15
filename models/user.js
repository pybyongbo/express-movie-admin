/**
 * User model module.
 * @file 和用户数据模型
 * @module model/user
 * @author pybyongbo <https://blog.901web.com>
 */

 const {mongoose} = require('./mongodb');
 
 const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    create_date	 :{ type: Date, default: Date.now},
    regdata:Date
 });


var User = mongoose.model('User', UserSchema,'user');
var UserDAO = function(){};

/*
  Connection#model(name,[schema],[collection])

  collection名称应该为第三个参数,若为缺省,会自动根据参数name的值易复数形式生成collection

  如果填写第三个参数,则第三个参数为collection的名称.
*/

// module.exports = mongoose.model('User', UserSchema,'user');

// UserDAO.prototype.find = function(obj, callback) {
//   User.find({},function(err,obj){
//     callback(err,obj)
//   })
// };

//会员注册提交插入数据库方法
UserDAO.prototype.doRegister = function(userobj,callback){
    // User.save(userobj, function(err, obj){
    //   callback(err, obj);
    // });

    var instance = new User(userobj);
    instance.save(function(err){
      callback(err);
    });

}



//会员登录查询数据库处理方法
UserDAO.prototype.findUser = function(userobj,callback){
    User.findOne(userobj, function(err, obj){
      callback(err, obj);
    });
}

// 修改密码操作
UserDAO.prototype.modfiypassword = function(userobj,callback){

    var username=userobj.username;
    User.updateOne({username:username}, userobj, function(err,obj){
      callback(err, obj);
    });


}




//会员列表分页方法
UserDAO.prototype.findPagination = function(obj,callback) {
  var q=obj.search||{}
  var col=obj.columns;

  var pageNumber=obj.page.num||1;
  var resultsPerPage=obj.page.limit||10;

  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = User.find(q,col).sort('-create_date').skip(skipFrom).limit(resultsPerPage);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      User.countDocuments(q, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          var pageCount = Math.ceil(count / resultsPerPage);
          callback(null, pageCount, results);
        }
      });
    }
  });
}

module.exports = new UserDAO();