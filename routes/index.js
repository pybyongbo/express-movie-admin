var express = require('express');
var router = express.Router();
var moment = require('moment');
const _Movieadd = require('./../models/movienew.js');
var utilFun = require('../util/index.js');

const User = require('./../models/user');

// 登录成功
// router.route('/').get(function(req, res) {

//     if(!req.session.user){
//         req.session.error = "请先登录"
//         res.redirect("/login");	
//     }

//     // res.render('home', { title: '用户中心',user:req.session.user });
//     res.render('header',{title: '用户中心',user:req.session.user})
// });
/* GET home page. */
exports.getList = function(req,res){

    var search = {isshow:1}; //默认查询前台页面显示的数据
    var page = {limit:8,num:1};
    //查看哪页
    if(req.query.p) {
        page['num'] = req.query.p<1?1:req.query.p; 
    }
    if(req.query.title){
        search['title']=new RegExp(req.query.title);//模糊查询参数
    }

    if(req.query.language){
        search['language']=new RegExp(req.query.language);//模糊查询参数
    }

    if(req.query.doctor){
        search['doctor']=new RegExp(req.query.doctor);//模糊查询参数
    }

    if(req.query.type){
        search['type']=new RegExp(req.query.type);//模糊查询参数
    }

    if(req.query.year){
      search['year']=req.query.year;//模糊查询参数
    }

    var model =  {
        search:search,
        columns:'author title doctor country language poster summary meta flash year type',
        page:page
    }

    _Movieadd.findPagination(model,function(err,pageCount,list){
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;

        return res.render('index', {
            title:'电影|管理|moive.me',
            message:'电影列表页面',
            mvlist:list,
            page:page
        });

    })

};

// 登录
// router.route('/login').get(function(req,res){

//   if(req.session.user){
//     res.redirect("/home");	
//   }
//   res.render('login',{title:'登录',message:'登录页面'})
// })

exports.login = function(req,res){

  if(req.session.user){
    res.redirect("/home");	
  }
  res.render('login',{title:'登录',message:'登录页面'})

}

//注册
// router.route('/register').get(function(req,res){
//     if(req.session.user){
//       res.redirect("/home");	
//     }
//     res.render('register',{title:'注册',message:'注册页面'})
// })

exports.register = function(req,res){

    if(req.session.user){
      res.redirect("/user/home");	
    }
    
    res.render('register',{title:'注册',message:'注册页面'})

}

exports.usercenter = function(req,res){

    // res.render('home', { title: '用户中心',user:req.session.user });
    if(req.session.user){
      res.render('home',{title:'用户中心',message:'个人中心页面',user:req.session.user})
    } else {
      res.redirect("/user/login");	
    }
    
}

//注销,退出登录
// router.route('/logout').get(function(req, res) {

//   req.session.user=null;
//   req.session.error = null;
//   res.redirect("/");	

// });

//注销,退出登录
exports.userlogout = function(req,res){

    req.session.user=null;
    req.session.error = null;
    res.redirect("/");	
}

// router.route('/user/list').get(function(req,res){

//     User.find(function(err, usersdata) {
//         if (err) {
//             console.log(err);
//         }
//         res.render('userlist', {
//             title: '会员列表',
//             message:'会员列表页面',
//             users: usersdata
//         });
//     });
  
  // res.render('userlist',{title:'会员列表',message:'会员列表页面'});
// });



// module.exports = router;
