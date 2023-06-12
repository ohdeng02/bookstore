var db = require('./db');
var qs = require('querystring');

function authIsOwner(request,response){
    if(request.session.is_logined){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    login: function(request, response){
        var subdoc;
        if(authIsOwner(request, response) === true){
            subdoc = 'book.ejs';
        }else{
            subdoc = 'login.ejs';
        }
        var context = {doc: subdoc,
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class,
                        kind:'로그인'};
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    login_process: function(request, response){
            var body = '';
            request.on('data', function(data){
                body = body+data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                db.query(`SELECT loginid, password, class FROM person WHERE loginid = ? and password = ?`,
                    [post.id, post.pw], function(error, result){ 
                        if(error){
                            throw error;
                        }
                        if(result[0] === undefined){
                            response.end('Who?');
                        }else{
                            request.session.is_logined = true;
                            request.session.login_id = result[0].loginid;
                            request.session.class = result[0].class;
                            response.redirect('/');
                        }
                });
            });
    },
    logout: function(request, response){
        request.session.destroy(function(err){
            response.redirect('/');
        });
    },
    register: function(request, response){
        var titleofcreate = 'Create';
        var context = {doc: `./register.ejs`,
                        pw: '',
                        name:'',
                        address:'',
                        tel:'',
                        birth:'',
                        kindOfDoc: 'C',
                        loggined:authIsOwner(request,response),
                        id:'', 
                        cls: request.session.class
                    };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    register_process:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var regi = qs.parse(body);
            db.query(` 
                INSERT INTO person (loginid, password, name, address, tel, birth, class, grade)
                    VALUES(?, ?, ?, ?, ?, ?, 'B', '1')`, //id값은 자동으로 늘어난 값이 추가가됨.
                [regi.id, regi.pw, regi.name, regi.address, regi.tel, regi.birth], function(error, result){ 
                    if(error){
                        throw error;
                    }
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    },
    passwordChange:function(request,response){
        var context = {doc: `./login.ejs`,
                        pw: '',
                        newPW:'',
                        newPWR:'',
                        kind:'비밀번호변경',
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class
                    };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    passwordChange_process:function(request,response){
        var body = '';
            request.on('data', function(data){
                body = body+data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                db.query(`SELECT loginid, password FROM person WHERE loginid = ? and password = ?`,
                    [request.session.login_id, post.pw], function(error, result){ 
                        if(error){
                            throw error;
                        }
                        if(result[0] === undefined){
                            response.end('password error');
                        }
                        else if(post.newPW !== post.newPWR){
                            response.end('newpassword error');
                        }else{                            
                            db.query(`UPDATE person SET password=? WHERE loginid=? and password=?`,
                            [post.newPW, result[0].loginid, result[0].password], function(error2, result2){ 
                                if(error2){
                                    throw error2;
                                }
                                response.writeHead(302, {Location: `/`}); 
                                response.end();
                            });
                        }
                });
            });
    }
}