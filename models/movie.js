/**
 * User model module.
 * @file 权限和用户数据模型
 * @module model/user
 * @author biaochenxuying <https://github.com/biaochenxuying>
 */


const { mongoose } = require('./mongodb');
// const autoIncrement = require('mongoose-auto-increment');

const MovieSchema = new mongoose.Schema({
    name          : String,
    alias   	    : Number,
    publish       : Date,
    create_date	  :{ type: Date, default: Date.now},
    isshow        :Boolean,
    images        :{
      coverSmall:String,
      coverBig:String,
    },
    source        :[{
      source:String,
      link:String,
      swfLink:String,
      quality:String,
      version:String,
      lang:String,
      subtitle:String,
      create_date  : { type: Date, default: Date.now }
    }]

});

var Movie = mongoose.model('Movie', MovieSchema,'movie');
var MovieDAO = function(){};


/*
  Connection#model(name,[schema],[collection])

  collection名称应该为第三个参数,若为缺省,会自动根据参数name的值易复数形式生成collection

  如果填写第三个参数,则第三个参数为collection的名称.
*/
MovieDAO.prototype.save = function(obj, callback) {
  var instance = new Movie(obj);
  instance.save(function(err){
    callback(err);
  });
};

// MovieDAO.prototype.find = function(obj, callback) {
//   Movie.find({},function(err,obj){
//     callback(err,obj)
//   })
// };

MovieDAO.prototype.findPagination = function(obj,callback) {
  var q=obj.search||{}
  var col=obj.columns;

  var pageNumber=obj.page.num||1;
  var resultsPerPage=obj.page.limit||10;

  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = Movie.find(q,col).sort('-create_date').skip(skipFrom).limit(resultsPerPage);

  console.log(q);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      Movie.countDocuments(q, function(error, count) {
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

module.exports = new MovieDAO();
