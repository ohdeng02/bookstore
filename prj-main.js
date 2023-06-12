var express= require('express');
var app = express();
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
var db = require('./lib/db');
var parseurl = require('parseurl');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);

var etc = require('./lib/etc');
var book = require('./lib/book');
var auth = require('./lib/authentication');
var name = require('./lib/name');
var user = require('./lib/user');
var search = require('./lib/search');
var board = require('./lib/board');
const { authorSelect } = require('./lib/template2');

var options = {
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'webdb2022'
};
var sessionStore = new MySqlStore(options);
app.use(express.static('public'));
app.use(session({
    secret: 'asd%!@#^$fgsfe&edx',
    resave: false,
    saveUninitialized:true,
    store: sessionStore
}));

app.get('/', function(request, response){
    response.redirect('/booklist/1');
});
app.get('/booklist/:bpNum', function(request, response){
    book.book(request,response);
});
app.get('/book_detail/:bookId', function(request, response){
    book.detail(request,response);
});

app.get('/login',function(request, response){
    auth.login(request,response);
});
app.post('/login_process',function(request, response){
    auth.login_process(request,response);
});
app.get('/logout',function(request, response){
    auth.logout(request,response);
});
app.get('/calender', function(request, response){
    etc.calenderHome(request, response);
});
app.get('/calender/create', function(request, response){
    etc.calenderCreate(request,response);
});
app.post('/calender/create_process', function(request, response){
    etc.calenderCreate_process(request,response);
});
app.get('/calender/list', function(request, response){
    etc.calenderList(request,response);
});
app.get('/calender/update/:planId', function(request, response){
    etc.calenderUpdate(request,response);
});
app.post('/calender/update_process/:planId', function(request, response){
    etc.calenderUpdate_process(request,response);
});
app.get('/calender/delete_process/:planId', function(request, response){
    etc.calenderDelete_process(request,response);
});

app.get('/namecard', function(request, response){
    name.namecardHome(request, response);
});
app.get('/namecard/create', function(request, response){
    name.namecardCreate(request,response);
});
app.post('/namecard/create_process', function(request, response){
    name.namecardCreate_process(request,response);
});
app.get('/namecard/list', function(request, response){
    name.namecardList(request,response);
});

app.get('/namecard/update/:cardId', function(request, response){
    name.namecardUpdate(request,response);
});
app.post('/namecard/update_process/:cardId', function(request, response){
    name.namecardUpdate_process(request,response);
});
app.get('/namecard/delete_process/:cardId', function(request, response){
    name.namecardDelete_process(request,response);
});

app.get('/user', function(request, response){
    user.userHome(request, response);
});
app.get('/user/create', function(request, response){
    user.userCreate(request,response);
});
app.post('/user/create_process', function(request, response){
    user.userCreate_process(request,response);
});
app.get('/user/list', function(request, response){
    user.userList(request,response);
});
app.get('/user/update/:userId', function(request, response){
    user.userUpdate(request,response);
});
app.post('/user/update_process/:userId', function(request, response){
    user.userUpdate_process(request,response);
});
app.get('/user/delete_process/:userId', function(request, response){
    user.userDelete_process(request,response);
});

app.get('/book', function(request, response){
    book.home(request,response);
});
app.get('/book/list', function(request, response){
    book.bookList(request,response);
});
app.get('/book/create', function(request, response){
    book.bookCreate(request,response);
});
app.post('/book/create_process', function(request, response){
    book.bookCreate_process(request,response);
});
app.get('/book/update/:bookId', function(request, response){
    book.bookUpdate(request,response);
});
app.post('/book/update_process/:bookId', function(request, response){
    book.bookUpdate_process(request,response);
});
app.get('/book/delete_process/:bookId', function(request, response){
    book.bookDelete_process(request,response);
});
app.get('/ebook', function(request, response){
    book.ebook(request,response);
});
app.get('/bestSeller', function(request, response){
    book.bestSeller(request,response);
});
app.get('/monBook', function(request, response){
    book.monBook(request,response);
});


app.get('/register', function(request, response){
    auth.register(request, response);
});
app.post('/register_process', function(request, response){
    auth.register_process(request, response);
});
app.get('/passwordChange', function(request, response){
    auth.passwordChange(request, response);
});
app.post('/passwordChange_process', function(request, response){
    auth.passwordChange_process(request, response);
});

app.get('/book/search', function(request, response){
    search.bookSearch_get(request, response);
});
app.post('/book/search', function(request, response){
    search.bookSearch_post(request, response);
});

app.get('/namecard/search', function(request, response){
    search.namecardSearch_get(request, response);
});
app.post('/namecard/search', function(request, response){
    search.namecardSearch_post(request, response);
});

app.get('/calender/search', function(request, response){
    search.calenderSearch_get(request, response);
});
app.post('/calender/search', function(request, response){
    search.calenderSearch_post(request, response);
});

app.post('/book/cart', function(request,response){
    book.cart_post(request,response);
});
app.get('/book/cart', function(request,response){
    book.cart_get(request,response);
});
app.post('/book/cart/update', function(request,response){
    book.cartUpdate(request,response);
});
app.post('/book/purchase_post', function(request,response){
    book.purchase_post(request,response);
});
app.post('/book/purchase_multi', function(request,response){
    book.purchase_multi(request,response);
});

app.get('/book/purchase_get', function(request,response){
    book.purchase_get(request,response);
});
app.post('/book/purchase_cancel', function(request,response){
    book.purchase_cancel(request,response);
});

app.get('/board/list/:pNum', function(request, response){
    board.list(request,response);
});
app.get('/board/view/:bNum/:pNum', function(request, response){
    board.view(request,response);
});
app.get('/board/create', function(request, response){
    board.create(request,response);
});
app.post('/board/create_process', function(request, response){
    board.create_process(request,response);
});
app.get('/board/update/:bNum/:pNum', function(request, response){
    board.update(request,response);
});
app.post('/board/update_process', function(request, response){
    board.update_process(request,response);
});
app.get('/board/delete/:bNum/:pNum', function(request, response){
    board.delete(request,response);
});


app.listen(3000, ()=> console.log('Example app listening on port 3000'));