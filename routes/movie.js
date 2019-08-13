const Movie = require('./../models/movie.js');
const _Movieadd = require('./../models/movienew.js');

let multiparty = require("multiparty");
let fs = require("fs");

//表单提交数据
const _Movie = require('./../models/movienew.js');

exports.movieadd = function(req,res){

    if(req.session.user) {
        return res.render('movieadd',{
            title:'新增加|电影|管理|moive.me',
            label:'新增电影(表单提交)',
            user:req.session.user
        });
    } else {
        res.redirect("/user/login?returnUrl=/movie/add");
    }

}


exports.moviejsonAdd = function(req, res) {

    if(req.session.user) {
        return res.render('moviejson',{
            title:'新增加|电影|管理|moive.me',
            label:'新增加电影(写入json文件)'
        });
    } else {
        // console.log(req.headers.host);
        res.redirect("/user/login?returnUrl=/movie/jsonadd");
    }
};


//新增电影,表单提交

exports.doMovieAddnew = function(req,res){

    var id = req.body.movie._id;
    var movieObj = req.body.movie;

    if(id!=undefined){

       //执行update修改操作
        _Movieadd.findByIdAndUpdate(movieObj,function(err){
            if(err){
                console.log(err);
            } else {
                res.send({'success':true,'code':200,'message':'提交成功'});
            }
        })


    } else{
        //新增的操作
        _Movieadd.savenew(movieObj,function(err){
            if(err){
                console.log(err);
            } else {
                res.send({'success':true,'code':200,'message':'提交成功'});
            }
        })
    }
};

exports.doMovieUpload = function(req,res){

    console.log("------");
    console.log(req.host+req.port);

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/upload/'});
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            // var inputFile = files[0];
            var inputFile = files.fulAvatar[0];
    
            var uploadedPath = inputFile.path;
     
            var dstPath = './public/upload/' + inputFile.originalFilename;

            var paths = "http://localhost:4500/upload/" + inputFile.originalFilename;

            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    res.json({code: 200, filePath: './upload/' + inputFile.originalFilename,fullPath:paths});
                }
            });
        }
    });

}


exports.doMoviedelete = function(req,res){

    var _id = req.body._id;

    //执行update修改操作
    _Movieadd.deleteOne({_id:_id},function(err){
        if(err){
            console.log(err);
        } else {
            res.send({'success':true,'code':200,'message':'提交成功'});
        }

    })
}

//json文件提交:
exports.doMovieAdd = function(req, res) {

    var json = req.body.content;
    //保存到数据库
    // let movie = new Movie(json);
    // movie.save().then(data=>{
    //     res.send({'success':true,'code':200,'message':'提交成功'});
    // }).catch(err => {
    //     console.log(err);
    //   return;
    // });
    Movie.save(json,function(err){
        if(err){
            console.log(err);
        } else {
            res.send({'success':true,'code':200,'message':'提交成功'});
        }

    })

}


exports.movieJSON = function(req, res) {
    Movie.findByName(req.params.name,function(err, obj){
        res.send(obj);
    });
}


exports.movielist = function(req,res){

    var search = {isshow:1}; //默认查询前台页面显示的数据
    var page = {limit:5,num:1};
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

    var model =  {
        search:search,
        columns:'author title doctor country language poster summary meta flash year type',
        page:page
    }

    _Movieadd.findPagination(model,function(err,pageCount,list){
        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;

        return res.render('mvlist', {
            title:'电影|管理|moive.me',
            message:'电影列表页面',
            mvlist:list,
            page:page
        });

    })

}


exports.moviedetail = function(req,res){

    var id=req.params.id;

    _Movieadd.findMovie({_id:id},function(err,result){

        // console.log(result);
        return res.render('mvdetail',{
            title:'电影详情|电影|moive.me',
            message:'电影详情页面',
            // id:req.params.id
            mvdetailObj:result
        });

    })

    


}


exports.movielistmanage = function(req,res){

    if(req.session.user) {
        var search = {};
        var page = {limit:10,num:1};
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

    if(req.query.isshow){
        search['isshow']=req.query.isshow;//模糊查询参数
    }

    var model =  {
        search:search,
        columns:'author title doctor country language poster summary meta flash year type isshow',
        page:page
    }

    _Movieadd.findPagination(model,function(err,pageCount,list){

        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;

        return res.render('mvlistmanage', {
            title:'电影列表|电影|管理|moive.me',
            message:'电影列表管理页面',
            mvlist:list,
            page:page,
            user:req.session.user,
            searchObj:search
        });

    })
    } else {
        res.redirect("/user/login?returnUrl=/movie/list/manage");
    }

}


exports.jsonmovie = function(req,res){

    var search = {};
    var page = {limit:5,num:1};
    //查看哪页
    if(req.query.p) {
        page['num'] = req.query.p<1?1:req.query.p; 
    }
    if(req.query.name){
        //search.name = req.query.name; //这种只能够精确查询
        search['name']=new RegExp(req.query.name);//模糊查询参数
    }


    var model =  {
        search:search,
        columns:'name alias isshow publish create_date',
        page:page
    }

    Movie.findPagination(model,function(err,pageCount,list){

        page['pageCount']=pageCount;
        page['size']=list.length;
        page['numberOf']=pageCount>5?5:pageCount;

        return res.render('mvjsonlist', {
                title:'电影|管理|moive.me',
                message:'电影列表页面(json文件提交录入)',
                mvlist:list,
                page:page
        });

    })

}


