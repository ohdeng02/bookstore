var express= require('express');
var app = express();
var cookie = require('cookie');

app.get('/',function(request, response){
    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 
                    'tasty_cookie=strawberry',
                    `Permanent=cookies;Max-Age=${60*60*24*30}`]
    });
    console.log(request.headers.cookie);
    if(request.headers.cookie != undefined){
        var cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    console.log(cookies.Permanent);
    response.end('Cookie!!');
});
// app.set('views', __dirname+'/views');
// app.set('view engine', 'ejs');
// //var http = require('http');
// var urlm = require('url');
// var qs = require('querystring');
// var templates = require('./lib/template.js');
// var db = require('./lib/db');
// var topic = require('./lib/topic');
// var author = require('./lib/author');
// const { compileFunction } = require('vm');
// const { response } = require('express');


// app.get('/', function(request, response){
//     topic.home(request, response);
// })
// app.get('/page/:pageId', function(request, response){
//     topic.page(request, response);
// })
// app.get('/create',function(request, response){
//     topic.create(request, response);
// })
// app.post('/create_process', function(request, response){
//     topic.create_process(request, response);
// })
// app.get('/update/:pageId', function(request, response){
//     topic.update(request, response);
// })
// app.post('/update_process', function(request, response){
//     topic.update_process(request, response);
// })
// app.post('/delete_process', function(request, response){
//     topic.delete_process(request, response);
// })
// app.get('/author', function(request, response){
//     author.home(request, response);
// })
// app.post('/author/create_process', function(request, response){
//     author.create_process(request, response);
// })
// app.get('/author/update/:pageId', function(request, response){
//     author.update(request, response);
// })
// app.post('/author/update_process', function(request, response){
//     author.update_process(request, response);
// })
// app.post('/author/delete_process', function(request, response){
//     author.delete_process(request, response);
// })

app.listen(3000, ()=> console.log('Cookie Test'))

