var sanitizeHtml = require('sanitize-html');

var templates = {
    HTML: function(title, list, body, control){
        return `
        <!DOCTYPE html>
            <html>
                <head>
                    <title>Web1 - ${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>  
                    ${list}
                    ${control}
                    ${body}
                </body>
            </html>
        `;
    },
    list:function(calenders){
        var list='<ul>';
        var i =0;
        while(i<calenders.length){
            list = list+`<li><a href = "/?id=${calenders[i].id}">${calenders[i].title}</a></li>`;
            i+=1;
        } //겹치니까 함수로 빼줄 수 있음.
        list+='</ul>';
        return list;
    },
        authorSelect:function(authors, author_id){
            var tag='';
            var i =0;
            while(i<authors.length){
                var selected = '';
                if(authors[i].id === author_id){
                    selected = ' selected';
                }
                tag+=`<option value = "${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`;
                i++;
            }
            return `
                    <select name="author">
                        ${tag}
                    </select>
                    `
    }
}

module.exports = templates;