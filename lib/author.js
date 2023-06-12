var db = require('./db');
var templates = require('./template.js');
var urlm = require('url');
var qs = require('querystring');
const { devNull } = require('os');

module.exports = {
    home: function(request, response){
        db.query(`SELECT * FROM topic`, function(error, topics){
            db.query(`SELECT * FROM author`, function(error2, authors){
                var title = 'author';
                var description = 'Hello, Node.js';
                var list = templates.list(topics);
                var authorTable = templates.authorTable(authors);
                var template = templates.HTML(title,list,
                `${authorTable}
                <style>
                    table{border-collapse: collapse;}
                    td{border: 1px solid black;}
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>`,
                ``);
            //console.log(topics);
            response.writeHead(200);
            response.end(template);
            });
        });
    },
        create_process: function(request, response){
            var body = '';
            request.on('data', function(data){
                body = body+data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                db.query(` 
                    INSERT INTO author (name, profile) VALUES(?, ?)`,
                    [post.name, post.profile], function(error, result){ 
                        if(error){
                            throw error;
                        }
                    response.writeHead(302, {Location: `/author`});
                    response.end();
                });
            });
        },
        update: function(request, response){
            var url = request.url;
            //var queryData = urlm.parse(url, true).query;
            var id = request.params.pageId;
            db.query('SELECT * FROM topic', function(error, topics){
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM author`, function(error2, authors){
                    if(error2){
                        throw error2;
                    }
                    db.query('SELECT * FROM author WHERE id=?', [id], function(error3, author){
                        var title="author"
                        var list=templates.list(topics);
                        var template = templates.HTML(title,list,
                        `
                        ${templates.authorTable(authors)}
                        <style>
                            table{border-collapse: collapse;}
                            td{border: 1px solid black;}
                        </style>
                        <form action = "/author/update_process" method="post">
                            <input type="hidden" name="id" value="${id}">
                            <p><input type = "text" name = "name" placeholder="name" value="${author[0].name}"></p>
                            <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                            <p><input type = "submit" value="update"></p>
                        </form>
                        `,``);
                        response.writeHead(200);
                        response.end(template);
                    });
                });
            });
        },
        update_process: function(request, response){
            var body='';
            request.on('data', function(data){
                body+=data;
            });
            request.on('end',function(){
                var post = qs.parse(body);
                db.query('UPDATE author SET name=?, profile=? WHERE id=?',
                    [post.name, post.profile, post.id], function(error, result){
                        if(error){
                            throw(error);
                        }
                    response.writeHead(302, {Location: `/author`});
                    response.end();
                });
            });
        },
        delete_process: function(request, response){
            var body='';
            request.on('data', function(data){
                body = body+data;
            });
            request.on('end', function(){
                var post = qs.parse(body);
                db.query('DELETE FROM topic WHERE author_id=?', [post.id], function(error1,result1){
                    if(error1){
                        throw error1;
                    }
                    db.query(`DELETE FROM author WHERE id=?`, [post.id], function(error, result){
                        if(error){
                            throw error;
                        }
                        response.writeHead(302, {Location: `/author`});
                        response.end();
                    });
            });
        });
        }
    }