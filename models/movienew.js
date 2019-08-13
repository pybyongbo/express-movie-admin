/**
 * User model module.
 * @file 权限和用户数据模型
 * @module model/movie/add/new
 * @author pybyongbo <https://901web.com>
 */

const { mongoose } = require('./mongodb');

const MovienewSchema = new mongoose.Schema({
    author          : String,
    doctor          : String,
    title   	      : String,
    language        : String,
    type            : String,
    isshow          : Number,
    country         : String,
    summary         : String,
    flash           : String,
    poster          : String,
    year            : Number,
    meta            :{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }

});


var Movienew = mongoose.model('Movienew', MovienewSchema,'movienew');
var MovienewDAO = function(){};


/*
  Connection#model(name,[schema],[collection])

  collection名称应该为第三个参数,若为缺省,会自动根据参数name的值易复数形式生成collection

  如果填写第三个参数,则第三个参数为collection的名称.
*/
MovienewDAO.prototype.savenew = function(obj,callback){
    // User.save(userobj, function(err, obj){
    //   callback(err, obj);
    // });
    var instance = new Movienew(obj);
    instance.save(function(err){
      callback(err);
    });

}

//编辑功能,查找单条
MovienewDAO.prototype.findByIdAndUpdate = function(obj,callback){
    var _id=obj._id;
    // delete obj._id;
    Movienew.updateOne({_id:_id}, obj, function(err,obj){
      callback(err, obj);
    });
}

//编辑功能,查找单条
MovienewDAO.prototype.deleteOne = function(obj,callback){
  var _id=obj._id;
  // delete obj._id;
  Movienew.deleteMany({_id:_id}, function(err,obj){
    callback(err, obj);
  });
}


MovienewDAO.prototype.findMovie = function(mvobj, callback) {
  Movienew.findOne(mvobj,function(err,obj){
    callback(err,obj)
  })
};

MovienewDAO.prototype.findPagination = function(obj,callback) {
  var q=obj.search||{}
  var col=obj.columns;

  var pageNumber=obj.page.num||1;
  var resultsPerPage=obj.page.limit||10;

  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = Movienew.find(q,col).sort('-meta.createAt').skip(skipFrom).limit(resultsPerPage);

  console.log(q);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
        Movienew.countDocuments(q, function(error, count) {
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



module.exports = new MovienewDAO();