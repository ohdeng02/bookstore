var db = require('./db');
var templates = require('./template.js');
var urlm = require('url');
var qs = require('querystring');
const { devNull } = require('os');

module.exports = {
    home: function(request, response){
        var url = request.url;
        var id = request.params.pageId;
        db.query(`SELECT * FROM topic`, function(error, topics){
            var titleoftopic = 'Welcome';
            var description = 'Hello, Node.js';
            var context = {title:titleoftopic,
                            list:topics,
                            control: `<a href="/create">create</a>`,
                            body:`<h2>${titleoftopic}</h2>${description}`
                        };
            
            //console.log(topics);
            request.app.render('home', context, function(err, template){
                response.end(template);                
            });
        });
    },
    page: function(request, response){
        var url = request.url;
        var id = request.params.pageId;
        db.query(`SELECT * FROM topic`, function(error, topics){
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[id], function(error2, topic){
                    if(error2){                     //id=${queryData.id}처럼 id를 전달하면 보안문제발생
                        throw error2;
                    }
                    //console.log(topic);
                    var titleoftopic = topic[0].title;
                    var descriptionoftopic = topic[0].description;
                    var context = {title: titleoftopic,
                                        list:topics,
                                        control: `<a href="/create">create</a> 
                                        <a href="/update/${id}">update</a>
                                        <form action="/delete_process" method="post"> 
                                            <input type="hidden" name="id" value="${id}">
                                            <input type="submit" value="delete">
                                        </form>`,
                                        body:`<h2>${titleoftopic}</h2>${descriptionoftopic}<p>by ${topic[0].name}</p>` 
                                    };
                    request.app.render('home', context, function(err, template){
                        response.end(template);
                    });
                });
            });
        },
        create: function(request, response){
            db.query(`SELECT * FROM topic`, function(error, topics){
                db.query(`SELECT * FROM author`, function(error2, authors){
                    var titleofcreate = 'Create';
                    var context = {title: titleofcreate,
                                    list: topics,
                                    control: `<a href="/create">create</a>`,
                                    body: `
                                    <form action = "http://localhost:3000/create_process" method="post">
                                        <p><input type = "text" name = "title" placeholder="title"></p>
                                        <p><textarea name="description" placeholder="description"></textarea></p>
                                        <p>${templates.authorSelect(authors)}</p>
                                        <p><input type = "submit"></p>
                                    </form>`};
                    request.app.render('home', context, function(err, template){
                        response.end(template);
                    });
                })
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
                    INSERT INTO topic (title, description, created, author_id)
                        VALUES(?, ?, NOW(), ?)`, //id값은 자동으로 늘어난 값이 추가가됨.
                    [post.title, post.description, post.author], function(error, result){ 
                        if(error){
                            throw error;
                        }
                    response.writeHead(302, {Location: `/page/${result.insertId}`});
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
                db.query(`SELECT * FROM topic WHERE id=?`,[id], function(error2, topic){
                    if(error2){
                        throw error2;
                    }
                    db.query('SELECT * FROM author', function(error2, authors){
                        var list=templates.list(topics);
                        var template = templates.HTML(topic[0].title,list,
                        `
                        <form action = "/update_process" method="post">
                            <input type="hidden" name="id" value="${topic[0].id}">
                            <p><input type = "text" name = "title" placeholder="title" value="${topic[0].title}"></p>
                            <p><textarea name="description" placeholder="description"${topic[0].description}></textarea></p>
                            <p>${templates.authorSelect(authors, topic[0].author_id)}</p>
                            <p><input type = "submit"></p>
                        </form>
                        `,`<a href="/create">create</a> <a href="/update/${topic[0].id}">update</a>`);
                        response.writeHead(200);
                        response.end(template);
                    });
                });
            });
        },
        update_process: function(request, response){
            var url = request.url;
            //var queryData = urlm.parse(url, true).query;
            var body='';
            request.on('data', function(data){
                body+=data;
            });
            request.on('end',function(){
                var post = qs.parse(body);
                db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
                    [post.title, post.description, post.author, post.id], function(error, result){
                    response.writeHead(302, {Location: `/page/${post.id}`});
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
                db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error,result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/`});
                    response.end();
            });
        });
        }
    }