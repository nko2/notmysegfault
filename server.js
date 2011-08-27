var app = require('express').createServer();
app.register('.html', require('ejs'));
app.set('view options', {
  layout: false
});

app.get('/', function(req, res){
  res.render('tests.html');
});

app.listen(3000);
