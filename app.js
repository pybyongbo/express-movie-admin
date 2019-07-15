var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var session = require('express-session');
var moment = require('moment'); //时间处理库

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movie = require('./routes/movie');

var app = express();

//数据库
const mongodb = require('./models/mongodb.js');
//data server
mongodb.connect(); //连接数据库


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('.html', ejs.__express);
// app.set('view engine', 'html');

app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
// app.use(express.static('./public'));

app.use(session({
  secret: 'secret',
  name: 'sid',
  'resave': false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if(err){
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red">'+err+'</div>';
    }
    next();
})

//basic 基本路由
// app.use('/', indexRouter);
// app.use('/register',indexRouter);
// app.use('/login',indexRouter);
// app.use('/home',indexRouter)
// app.use('/logout',indexRouter);

app.get('/',indexRouter.getList);
app.get('/user/login',indexRouter.login);
app.use('/user/register',indexRouter.register);
// app.use('/user/home',indexRouter.usercenter);
app.use('/user/home',usersRouter.findCurrentuserInfo);

app.use('/user/modfiypassword',usersRouter.modfiypassword); //显示修改密码模板


app.use('/user/logout',indexRouter.userlogout);
//会员列表
// app.use('/user/list',indexRouter);
// app.use('/user/list',indexRouter);
app.get('/user/list',usersRouter.finduserlist);

app.get ('/user/mymovielist',usersRouter.getMymovielist);


//修改密码,ajax提交
app.post('/user/modfiyuserpass',usersRouter.modfiyuserpass);



//注册入库操作
app.post('/register',usersRouter.doUserAdd);
//登录查库操作(请求后台地址)
app.post('/login',usersRouter.doLogin);
// app.get('/movie/:name',movie.movieAdd);


//路由地址
// app.get('/movie/list',movie.movielist); //列表页面

app.get('/movie/detail/:id',movie.moviedetail);//电影详情页面

app.get('/movie/list/manage',movie.movielistmanage);//电影列表管理页面

app.get('/movie/jsonlist',movie.jsonmovie);

//路由地址,访问页面
app.get('/movie/jsonadd',movie.moviejsonAdd);
app.get('/movie/add',movie.movieadd);


//提交保存操作,写入数据库
app.post('/movie/add',movie.doMovieAdd);
app.post('/movie/add/new',movie.doMovieAddnew);
app.post('/movie/uploadfile',movie.doMovieUpload);

app.post('/movie/delete',movie.doMoviedelete);



//数据格式化 日期格式化
app.locals.myDateFormat = function(date){
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};


//搜索框赋值
app.locals.searchStr = function(str){
  return str.replace(/\//g,"");
};


//在模板中这么使用就会解析html代码<%- statusStr(res.isshow) %>
app.locals.statusStr = function(status){

  switch (status) {
    case 0:
      return '<button class="btn btn-warning">否</button>'
      break;
    default:
      return '<button class="btn btn-success">是</button>'
  }
  
}


//电影列表,简介字段展示做截取
app.locals.summaryDesc = function(str,len){
    var strlen = 0;  
    var s = "";  
    for (var i = 0; i < str.length; i++) {  
        if (str.charCodeAt(i) > 128) {  
            strlen += 2;  
        } else {  
            strlen++;  
        }  
        s += str.charAt(i);  
        if (strlen >= len) {  
            return s+"...";  
        }  
    }  
    return s;  
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
