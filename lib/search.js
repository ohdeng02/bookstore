var db = require('./db');
var urlm = require('url');
var qs = require('querystring');

function authIsOwner(request,response){
    if(request.session.is_logined){
        return true;
    }else{
        return false;
    }
}

module.exports={
    bookSearch_get:function(request,response){
            var context = {doc:`./search.ejs`,
                            listyn: 'N',
                            kind: 'Book Search',
                            des:'책 제목을 입력하세요',
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class
                        };
            //console.log(topics);
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
    },
    bookSearch_post:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
        db.query(`SELECT * FROM book where name like ?`,[`%${post.keyword}%`],
            function(error, results){
            if(error){
                throw error;
            }
            //tmplogin = 'Y';
            var context = {doc:`./search.ejs`,
                            listyn: 'Y',
                            kind: 'Book Search',
                            des:'책 제목을 입력하세요',
                            bs: results,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class
                        };
            //console.log(topics);
                request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    });
    },
    namecardSearch_get:function(request,response){
        var context = {doc:`./search.ejs`,
                            loggined:true,
                            id: 'admin',
                            listyn: 'N',
                            kind: 'NameCard Search',
                            des:'직원이름을 입력하세요'
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
    },
    namecardSearch_post:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
        db.query(`SELECT * FROM namecard where name like ?`,[`%${post.keyword}%`],
            function(error, results){
            if(error){
                throw error;
            }
            var context = {doc:`./search.ejs`,
                            loggined:true,
                            id: 'admin',
                            listyn: 'Y',
                            kind: 'NameCard Search',
                            des:'직원이름을 입력하세요',
                            ns: results
                        };
                request.app.render('index', context, function(err, html){
                response.end(html);                
                });
            });
        });
    },
    calenderSearch_get:function(request,response){
        var context = {doc:`./search.ejs`,
                            loggined:true,
                            id: 'admin',
                            listyn: 'N',
                            kind: 'Calender Search',
                            des:'월을 입력하세요'
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
    },
    calenderSearch_post:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
        db.query(`SELECT * FROM calender where title like ?`,[`%${post.keyword}%`],
            function(error, results){
            if(error){
                throw error;
            }
            var context = {doc:`./search.ejs`,
                            loggined:true,
                            id: 'admin',
                            listyn: 'Y',
                            kind: 'Calender Search',
                            des:'월을 입력하세요',
                            cs: results
                        };
                request.app.render('index', context, function(err, html){
                response.end(html);                
                });
            });
        });
    }
}