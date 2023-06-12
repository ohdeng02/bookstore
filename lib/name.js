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
    namecardHome: function(request, response){
        db.query(`SELECT * FROM namecard`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./namecard/namecard.ejs`,
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
    namecardCreate: function(request, response){
        var titleofcreate = 'Create';
        var context = {doc: `./namecard/namecardCreate.ejs`,
                        name: '',
                        title: '',
                        tel:'',
                        kindOfDoc: 'C',
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class
                    };
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    namecardCreate_process: function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var card = qs.parse(body);
            db.query(` 
                INSERT INTO namecard (name, title, tel)
                    VALUES(?, ?, ?)`, //id값은 자동으로 늘어난 값이 추가가됨.
                [card.name, card.title, card.tel], function(error, result){ 
                    if(error){
                        throw error;
                    }
                response.writeHead(302, {Location: `/namecard`});
                response.end();
            });
        });
    },
    namecardList: function(request, response){
        db.query(`SELECT * FROM namecard`, function(error, result){
            if(error){
                throw error;
            }
            tmplogin = true;
            var context = {doc:`./namecard/namecardList.ejs`,
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
    namecardUpdate: function(request, response){
        var titleofcreate='Update';
        var cardId = request.params.cardId;
        db.query(`SELECT * FROM namecard where id=${cardId}`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./namecard/namecardCreate.ejs`,
                            name: result[0].name,
                            title:result[0].title,
                            tel:result[0].tel,
                            cId: cardId,
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
    namecardUpdate_process: function(request, response){
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end',function(){
            var card = qs.parse(body);
            cardId = request.params.cardId;
            db.query('UPDATE namecard SET name=?, title=?, tel=? WHERE id=?',
                [card.name, card.title, card.tel, cardId], function(error, result){
                response.writeHead(302, {Location: `/namecard`});
                response.end();
            });
        });
    },
    namecardDelete_process: function(request, response){
        var cardId = request.params.cardId;
            db.query('DELETE FROM namecard WHERE id = ?', [cardId], function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/namecard`});
                response.end();
        });
    }
}
