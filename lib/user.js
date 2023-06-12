var db = require('./db');
var urlm = require('url');
var qs = require('querystring');
const { devNull } = require('os');

function authIsOwner(request,response){
    if(request.session.is_logined){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    userHome: function(request, response){
        db.query(`SELECT * FROM person`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./user/user.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            results: result
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    userCreate: function(request, response){
        var titleofcreate = 'Create';
        var context = {doc: `./user/userCreate.ejs`,
                        loginid:'',
                        password:'',
                        name: '',
                        address: '',
                        tel:'',
                        birth:'',
                        clas:'',
                        grade:'',
                        kindOfDoc: 'C',
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class
                    };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    userCreate_process: function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var user = qs.parse(body);
            db.query(` 
                INSERT INTO person (loginid, password, name, address, tel, birth, class, grade )
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, //id값은 자동으로 늘어난 값이 추가가됨.
                [user.loginid, user.password, user.name, user.address, user.tel, user.birth, user.clas, user.grade], 
                function(error, result){ 
                    if(error){
                        throw error;
                    }
                response.writeHead(302, {Location: `/user`});
                response.end();
            });
        });
    },
    userList: function(request, response){
        db.query(`SELECT * FROM person`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./user/userList.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            results: result
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);    
            });
        });

    },
    userUpdate: function(request, response){
        var titleofcreate='Update';
        var userId = request.params.userId;
        db.query(`SELECT * FROM person WHERE loginid='${userId}'`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./user/userCreate.ejs`,
                            loginid:result[0].loginid,
                            password:result[0].password,
                            name:result[0].name,
                            address:result[0].address,
                            tel:result[0].tel,
                            birth:result[0].birth,
                            clas:result[0].class,
                            grade:result[0].grade,
                            uId: userId,
                            kindOfDoc: 'U',
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);    
            });
        });
    },
    userUpdate_process: function(request, response){
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end',function(){
            var user = qs.parse(body);
            userId = request.params.userId;
            db.query('UPDATE person SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, class=?, grade=? WHERE loginid=?',
                [user.loginid, user.password, user.name, user.address, user.tel, user.birth, user.clas, user.grade, userId], function(error, result){
                response.writeHead(302, {Location: `/user`});
                response.end();
            });
        });
    },
    userDelete_process: function(request, response){
        var userId = request.params.userId;
            db.query('DELETE FROM person WHERE loginid = ?', [userId], function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/user`});
                response.end();
        });
    }
}
