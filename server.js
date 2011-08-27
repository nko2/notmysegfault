var express = require('express'),
	MemoryStore = require('connect').session.MemoryStore,
	sessionStore = new MemoryStore(),
	app = express.createServer(),
	io = require('socket.io').listen(app);

var challenges = {},
		makeChallenge = (function() {
			var cid = 0;

			return function(leader) {
				var challenge = {
						id: cid++,
						users: [],
						sockets: [],
						leader: leader
					};
				
				challenges[challenge.id] = challenge;

				return challenge;
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
	store: sessionStore,
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

	var challenge = makeChallenge(req.session.user);

	res.redirect('/' + challenge.id);
});

app.get('/:id', function(req, res) {
	var challenge = challenges[req.params.id];

	if (!challenge) {
		res.send('CHALLENGE NO EXIST IDIOT', 404);
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
	var challenge;

	socket.on('talking-shit', function(data) {
		challenge = challenges[data.challengeId];

		if (!challenge) {
			failSocket(socket, 'That challenge doesnt exist.');
			return;
		}

		// Tell other people that we've got someone connected
		challenge.sockets.forEach(function(otherSocket) {
			otherSocket.emit('starting-something', {
				user: data.user
			});
		});

		// Add this user to the current users collection
		challenge.users.push(data.user);
		challenge.sockets.push(socket);

		// Let the user know the details of the challenge
		socket.emit('bring-it', {
			users: challenge.users,
			leader: challenge.leader
		});
	});

	socket.on('kick-off', function() {
		challenge.sockets.forEach(function(socket) {
			socket.emit('its-kicking-off');
		});
	});
});

app.listen(3000);
