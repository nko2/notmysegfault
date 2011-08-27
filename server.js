var express = require('express'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

var battles = {},
		makeBattle = (function() {
			var cid = 0;

			return function(leader) {
				var battle = {
						id: cid++,
						users: [],
						sockets: [],
						leader: leader
					};
				
				battles[battle.id] = battle;

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
app.use(express.session({
	secret:"I'm a motherf***ing pirate"
}));
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
	var battle = battles[req.params.id];

	if (!battle) {
		res.send('BATTLE NO EXIST IDIOT', 404);
		return;
	}

	ensureUser(req);

	res.render('battle.html', {
		user: req.session.user	
	});
});

function failSocket(socket, message) {
	socket.emit('bugger-off', {
		message: message
	});
}

io.sockets.on('connection', function(socket) {
	var battle, user;

	socket.on('talking-shit', function(data) {
		battle = battles[data.challengeId];
		user = data.user;

		if (!battle) {
			failSocket(socket, 'That battle doesnt exist.');
			return;
		}

		// Tell other people that we've got someone connected
		battle.sockets.forEach(function(otherSocket) {
			otherSocket.emit('starting-something', {
				user: data.user
			});
		});

		// Add this user to the current users collection
		battle.users.push(data.user);
		battle.sockets.push(socket);

		// Let the user know the details of the battle
		socket.emit('bring-it', {
			users: battle.users,
			leader: battle.leader
		});
	});

	socket.on('kick-off', function() {
		battle.sockets.forEach(function(socket) {
			socket.emit('its-kicking-off');
		});
	});

	socket.on('attack', function(data) {
		data.user = user;
		battle.sockets.forEach(function(socket) {
			socket.emit('attacked', data);
		});
	});
});

app.listen(3000);
