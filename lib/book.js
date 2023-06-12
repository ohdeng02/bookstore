var db = require('./db');
var urlm = require('url');
var qs = require('querystring');

function dateOfEightDigit(){
    var today = new Date();
    var nowdate = String(today.getFullYear());
    var month ;
    var day ;
    if (today.getMonth < 9)
        month = "0" + String(today.getMonth()+1);
    else
        month = String(today.getMonth()+1);

    if (today.getDate < 10)
        day = "0" + String(today.getDate());
    else
        day = String(today.getDate());
       
    return nowdate + month + day;
}

function authIsOwner(request,response){
    if(request.session.is_logined){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    home: function(request, response){
                db.query(`SELECT * FROM book`, function(error, results){
                if(error) {
                    throw error;
                }
                var context = {doc:`./book/book.ejs`,
                            kind: 'Book',
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            results: results,
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    book:function(request,response){
        db.query(`SELECT count(*) as total FROM book`,function(error, nums){
            var numPerPage = 4;
            var pageNum = request.params.bpNum
            var offs = (pageNum-1)*numPerPage;
            var totalPages = Math.ceil(nums[0].total / numPerPage);
            console.log(pageNum);
        
            db.query(`SELECT * FROM book ORDER BY pubdate, id LIMIT ? OFFSET ?`, [numPerPage, offs],function(error, results) {
                    if(error) {
                        throw error;
                    }
                    var context = {doc:`./book/book.ejs`,
                                kind: 'BookList',
                                loggined:authIsOwner(request,response),
                                id:request.session.login_id, 
                                cls: request.session.class,
                                results: results,
                                pageNum : pageNum,
                                totalpages : totalPages
                            };
                    request.app.render('index', context, function(err, html){
                    response.end(html);                
                });
            });
        });
    },
    detail: function(request, response){
            var bookId = request.params.bookId;
            db.query(`SELECT * FROM book where id=${bookId}`, function(error, result){
                if(error){
                    throw error;
                }
                var context = {doc:`./book/bookdetail.ejs`,
                                name: result[0].name,
                                author:result[0].author,
                                img:result[0].img,
                                bId: bookId,
                                price:result[0].price,
                                stock:result[0].stock,
                                loggined:authIsOwner(request,response),
                                id:request.session.login_id, 
                                cls: request.session.class    
                                };
                request.app.render('index', context, function(err, html){
                    response.end(html);    
                });
            });
    },
    bookCreate: function(request, response){
        var titleofcreate = 'Create';
        var context = {doc: `./book/bookCreate.ejs`,
                        name: '',
                        publisher: '',
                        author:'',
                        stock:0,
                        pubdate: '',
                        isbn: '',
                        img: '',
                        price: 0,
                        nation: '',
                        kindOfDoc: 'C',
                        cls : request.session.class,
                        loggined : authIsOwner(request, response),
                        id : request.session.login_id
                    }; 
        request.app.render('index', context, function(err, html){
            response.end(html);
        });
    },
    bookCreate_process: function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var bk = qs.parse(body);
            db.query(` 
                INSERT INTO book (name, publisher, author, stock, pubdate, ISBN, ebook, img, price, nation)
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, //id값은 자동으로 늘어난 값이 추가가됨.
                [bk.name, bk.publisher, bk.author, Number(bk.stock), bk.pubdate, bk.isbn, 'N', bk.img, Number(bk.price), bk.nation], function(error, result){ 
                    if(error){
                        throw error;
                    }
                response.writeHead(302, {Location: `/booklist/1`});
                response.end();
            });
        });
    },
    bookList: function(request, response){
        db.query(`SELECT * FROM book`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./book/bookList.ejs`,
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id,
                            results: result
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);    
            });
        });

    },
    bookUpdate:function(request,response){
        var titleofcreate='Update';
        var bookId = request.params.bookId;
        db.query(`SELECT * FROM book where id=${bookId}`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./book/bookCreate.ejs`,
                            name: result[0].name,
                            publisher: result[0].publisher,
                            author:result[0].author,
                            stock:result[0].stock,
                            pubdate: result[0].pubdate,
                            isbn: result[0].isbn,
                            img: result[0].img,
                            price: result[0].price,
                            nation: result[0].nation,
                            bId: bookId,
                            kindOfDoc: 'U',
                            cls : request.session.class,
                            loggined : authIsOwner(request, response),
                            id : request.session.login_id
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);    
            });
        });
    },
    bookUpdate_process:function(request,response){
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end',function(){
            var bk = qs.parse(body);
            bookId = request.params.bookId;
            db.query('UPDATE book SET name=?, publisher=?, author=?, stock=?, pubdate=?, ISBN=?, ebook=?, img=?, price=?, nation=? WHERE id=?',
                [bk.name, bk.publisher, bk.author, Number(bk.stock), bk.pubdate, bk.isbn, 'N', bk.img, Number(bk.price), bk.nation, bookId], 
                function(error, result){
                response.writeHead(302, {Location: `/booklist/1`});
                response.end();
            });
        });
    },
    bookDelete_process:function(request,response){
        var bookId = request.params.bookId;
            db.query('DELETE FROM book WHERE id = ?', [bookId], function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/booklist/1`});
                response.end();
        });
    },
    ebook:function(request,response){
        db.query(`SELECT * FROM book where ebook='T'`, function(error, result){
            if(error){
                throw error;
            }
            var context = {doc:`./book/book.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            kind: 'eBook',
                            results: result
                        };
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    bestSeller: function(request,response){
        db.query(`SELECT * FROM book B join (SELECT *  
            FROM( SELECT bookid,count(bookid) as numOfSeller 
                    FROM purchase  
                    group by bookid  
                    order by count(bookid) desc) A  
                    LIMIT 3) S on B.id = S.bookid`, 
        function(error, books){
            if(error){
                throw error;
            }
            var context = {doc:`./book/book.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            kind: 'Best Seller',
                            results: books
                        };
            //console.log(topics);
            request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    monBook:function(request,response){
        today=new Date();
        db.query(`SELECT * FROM book B join (SELECT*  
                    FROM(  
                        SELECT bookid, count(bookid) as numOfSeller  
                        FROM purchase 
                        WHERE left (purchasedate,6)=?  
                        group by bookid  
                        order by count(bookid) desc) A  
                        LIMIT 3) S on B.id=S.bookid`,[dateOfEightDigit().substring(0,6)], //String(today.getFullYear()+today.getMonth() + 1)
        function(error, books){
            if(error){
                throw error;
            }
            var context = {doc:`./book/book.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            kind: '이달의 책',
                            results: books
                        };
                request.app.render('index', context, function(err, html){
                response.end(html);                
            });
        });
    },
    cart_post:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var ct = qs.parse(body);
                db.query(`INSERT INTO cart (custid, bookid, cartdate, qty) VALUES(?, ?, ?, ?)`, 
                [ct.id, ct.bId, dateOfEightDigit(), ct.qty], function(error, result){ 
                    if(error){
                        throw error;
                    }
                    response.redirect('/book/cart');
                });  
            });
    },
    cart_get:function(request,response){
        db.query(`SELECT * FROM cart LEFT JOIN book ON cart.bookid=book.id WHERE cart.custid=?`, 
            [request.session.login_id], function(error, results){
            var context = {doc:`./cart.ejs`,
                        loggined:authIsOwner(request,response),
                        id:request.session.login_id, 
                        cls: request.session.class,
                        results: results
                        };
            request.app.render('index', context, function(err, html){
            response.end(html);                
            });
        });
    },
    cartUpdate:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var cartU = qs.parse(body);
            db.query(`UPDATE cart SET qty=? WHERE cartid=?`, [cartU.qty, cartU.cartid],function(error, result){
                if(error){
                    throw error;
                }
                response.redirect('/book/cart');
            });
        });
    },
    purchase_post:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var order = qs.parse(body);
            var price=order.price*order.qty
                db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty) VALUES(?, ?, ?, ?,?,?)`, 
                [order.id, order.bId, dateOfEightDigit(),price, price*0.01,order.qty], 
                function(error, result){ 
                    if(error){
                        throw error;
                    }
                    var stock=order.stock-order.qty
                    console.log(stock);
                    db.query(`UPDATE book SET stock=? where id=?`, [stock,order.bId], function(error2, result2){
                        if(error2){
                            throw error2;
                        }
                        response.redirect('/book/purchase_get');
                });
            });  
        });
    },
    purchase_multi:function(request,response){
        db.query(`SELECT * FROM cart LEFT JOIN book ON cart.bookid=book.id WHERE cart.custid=?`,[request.session.login_id],function(error,results){
            if(error){
                throw error;
            }
            var i=0;
            while(i<results.length){
                var price=results[i].price*results[i].qty;
                var stock=results[i].stock-results[i].qty;
                var bId=results[i].bookid;
                db.query(`INSERT INTO purchase (custid, bookid, purchasedate, price, point, qty) VALUES(?, ?, ?, ?,?,?)`,
                [request.session.login_id, results[i].bookid, dateOfEightDigit(), price,price*0.01,results[i].qty],
                function(error2,result2){
                });
                db.query(`UPDATE book SET stock=? where id=?`, [stock,bId], function(error3, result3){
                    if(error3){
                        throw error3;
                    }
                });
                db.query(`DELETE FROM cart WHERE cartid=?`,[results[i].cartid],function(error4,result4){
                    if(error4){
                        throw error4;
                    }
                });
                i++;
            }
            response.redirect('/book/purchase_get');
        });
    },
    purchase_get:function(request,response){
        db.query(`SELECT * FROM purchase LEFT JOIN book ON purchase.bookid=book.id WHERE custid=?`, 
                        [request.session.login_id], function(error, results){
                        var context = {doc:`./purchase.ejs`,
                            loggined:authIsOwner(request,response),
                            id:request.session.login_id, 
                            cls: request.session.class,
                            results: results
                            };
                            request.app.render('index', context, function(err, html){
                            response.end(html);                
                        });
                    });
    },
    purchase_cancel:function(request,response){
        var body = '';
        request.on('data', function(data){
            body = body+data;
        });
        request.on('end', function(){
            var cc = qs.parse(body);
            var stock=Number(cc.stock)+Number(cc.qty)
                db.query(`UPDATE purchase SET cancel=?, refund=?, point=? where purchaseid=?`, ['Y','Y',0,cc.purchaseid], 
                function(error, result){ 
                    if(error){
                        throw error;
                    }
                    
                    db.query(`UPDATE book SET stock=? where id=?`, [stock, cc.bookid],
                    function(error2, result2){
                        if(error2){
                            throw error2;
                        }
                        response.redirect('/book/purchase_get');
                    });
            });
        });
    }
}