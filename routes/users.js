var express = require('express');
var router = express.Router();

const User = require('./../models/user');
const _Movieadd = require('./../models/movienew.js');
const md5 = require("md5");

exports.doUserAdd = function(req, res) {

  var json = req.body;
  json.password = md5(req.body.password);
  //保存到数据库
  User.doRegister(json,function(err){
      if(err) {
          res.send({'success':false,'err':err});
      } else {
          res.send({'success':true,'code':200,'message':'提交成功'});
      }
  })

}

exports.doLogin = function(req, res) {

  var username=req.body.username;
  var password=req.body.password;

  User.findUser({username:username},function(err,result){

    if(err){
      res.send({'success':false,'code':500,'message':'操作失败'});
    }
    else if(!result){
      req.session.error='用户名不存在';
      res.send({'success':false,'code':404,'message':'用户名不存在'});
    }
    else{
      if(md5(password)!=result.password){
        req.session.error='密码错误';
        res.send({'success':false,'code':404,'message':'密码错误'});
      }
      else{
        req.session.user=result;
        res.send({'success':true,'code':200,'message':'登录成功'});
      }
    }
  })
    
}


exports.findCurrentuserInfo = function(req,res){

  let userobj = req.session.user;

  User.findUser({username:userobj.username},function(err,result){
    // res.send({'success':true,'code':200,'userinfo':result});
    return res.render('home', {
      title:'会员详情页面||express',
      userinfo:result
    });

  })

}

exports.modfiypassword = function(req,res){

  if(req.session.user){
    return res.render('modfiypassword', {
      title:'修改密码页面||express',
      user:req.session.user
    });
  } else {
    res.redirect("/user/login");	
  }

}

exports.modfiyuserpass = function(req,res){
    var json = req.body;
    json.password = md5(req.body.password);

    //更新保存到数据库
      User.modfiypassword(json,function(err){
        if(err) {
            res.send({'success':false,'err':err});
        } else {
            res.send({'success':true,'code':200,'message':'密码修改成功,下次请使用新密码登录!'});
        }
    })
}

exports.finduserlist = function(req,res){

    var search = {};
    var page = {limit:5,num:1};
    //查看哪页
    if(req.query.p) {
        page['num'] = req.query.p<1?1:req.query.p; 
    }
    if(req.query.username){
        search['username'] = req.query.username; //这种只能够精确查询
        //search['username']=new RegExp(req.query.username);//模糊查询参数
    }

    var model =  {
        search:search,
        columns:'username email create_date',
        page:page
    }

    User.findPagination(model,function(err,pageCount,list){
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;

        return res.render('userlist', {
                title:'会员列表页面||express',
                message:'会员列表页面',
                users:list,
                page:page
        });

    })

}


//查询当前用户发布的电影
exports.getMymovielist = function(req,res){

  var search = {author:req.session.user.username};
  var page = {limit:5,num:1};

  if(req.query.p) {
    page['num'] = req.query.p<1?1:req.query.p; 
  }

  var model =  {
      search:search,
      columns:'author title doctor country isshow language poster summary meta flash year type',
      page:page
  }

  _Movieadd.findPagination(model,function(err,pageCount,list){

      page['pageCount']=pageCount;
      page['size']=list.length;
      page['numberOf']=pageCount>5?5:pageCount;
      return res.render('mylist', {
              title:'我发布的电影列表页面||express',
              message:'我发布的电影列表页面',
              user:req.session.user,
              mymvlist:list,
              page:page
      });

  })

}

