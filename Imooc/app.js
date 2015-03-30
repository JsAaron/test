var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.set('views','./views');
app.set('view engine','jade');
app.listen(port);

app.get('/', function(req, res) {
	res.render('index',{
		title:'imooc 首页'
	})
})

console.log(11111111111)