var express = require('express'),
	app = express.createServer();

app.use(express.static(__dirname + '/public'));
app.register('.html', require('ejs'));
app.set('view options', {
  layout: false
});

app.get('/', function(req, res){
  res.render('tests.html');
});

app.listen(3000);
