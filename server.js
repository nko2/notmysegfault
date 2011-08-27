var express = require('express'),
	app = express.createServer();

var currentBattles = {},
	makeBattle = (function() {
		var cid = 0;

		return function(leader) {
			var battle = {
					id: cid++,
					users: [],
					leader: leader
				};
			
			currentBattles[battle.id] = battle;

			return battle;
		};
	})(),
	ensureUser = (function() {
		var uid = 1;

		return function(req) {
			if (!req.session.user) {
				req.session.user = 'User' + uid++;
			}
		};
	})();

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({secret:"I'm a motherf***ing pirate"}));
app.register('.html', require('ejs'));
app.set('view options', {
	layout: false
});

app.get('/', function(req, res){
	res.render('tests.html');
});

app.get('/begin', function(req, res) {
	ensureUser(req);

	var battle = makeBattle(req.session.user);

	res.redirect('/' + battle.id);
});

app.get('/:id', function(req, res) {
	var battle = currentBattles[req.params.id];

	if (!battle) {
		res.send('BATTLE NO EXIST IDIOT', 404);
		return;
	}

	ensureUser(req);

	res.render('battle.html');
});

app.listen(3000);
