var db = require('./db');
var templates = require('./template2.js');
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
    calenderHome: function(request, response){
        db.query(`SELECT * FROM calender`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./calender/calender.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            results: result,
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    calenderCreate: function(request, response){
        var titleofcreate = 'Create';
        var context = {doc: `./calender/calenderCreate.ejs`,
                        title: '',
                        description: '',
                        kindOfDoc: 'C',
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class
                    };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    calenderCreate_process: function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(` 
                INSERT INTO calender (title, description)
                    VALUES(?, ?)`, //id값은 자동으로 늘어난 값이 추가가됨.
                [cal.title, cal.description], function(error, result){ 
                    if(error){
                        throw error;
                    }
                response.writeHead(302, {Location: `/calender`});
                response.end();
            });
        });
    },
    calenderList: function(request, response){
        db.query(`SELECT * FROM calender`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./calender/calenderList.ejs`,
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
    calenderUpdate: function(request, response){
        var titleofcreate='Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM calender where id=${planId}`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./calender/calenderCreate.ejs`,
                            title: result[0].title,
                            description:result[0].description,
                            pId: planId,
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
    calenderUpdate_process: function(request, response){
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end',function(){
            var plan = qs.parse(body);
            planId = request.params.planId;
            db.query('UPDATE calender SET title=?, description=?, author_id=? WHERE id=?',
                [plan.title, plan.description, 2, planId], function(error, result){
                response.writeHead(302, {Location: `/calender`});
                response.end();
            });
        });
    },
    calenderDelete_process: function(request, response){
        var planId = request.params.planId;
            db.query('DELETE FROM calender WHERE id = ?', [planId], function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/calender`});
                response.end();
        });
    }
}
