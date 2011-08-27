var express = require('express'),
	everyauth = require('everyauth'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

if ( ! process.env.GITHUB_SECRET ) {
	throw new Error("I need a GITHUB_SECRET environment variable.");
}
if ( ! process.env.SESSION_SECRET ) {
	throw new Error("I need a GITHUB_SECRET environment variable.");
}

everyauth.everymodule.moduleErrback(function (err) {
	console.log('authentication error: ' + err);
});
everyauth.github
	.appId('975c82195d2da3957a07')
	.appSecret(process.env.GITHUB_SECRET)
	.handleAuthCallbackError(function(req, res){
		res.end('bad');
	})
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
		return { token: accessToken, meta: githubUserMetadata };
	})
	.redirectPath('/');

var battles = {},
		makeBattle = (function() {
			var cid = 0;

			return function(leader) {
				var battle = {
						id: cid++,
						users: [],
						sockets: [],
						leader: leader,
						state: 'waiting'
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
		})(),
		getUser = function(req) {
			var github = req.session.auth.github.user;

			return {
				id: github.id,
				gravatar: github.gravatar_id,
				login: github.login
			};
		};

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({
	secret: process.env.SESSION_SECRET
}));
app.use(everyauth.middleware());
everyauth.helpExpress(app);
app.register('.html', require('ejs'));
app.set('view options', {
	layout: false
});
app.dynamicHelpers({
	req: function(req, res){
		return req;
	},
	user: function(req, res){
		return req.session && req.session.auth && req.session.auth.github
	}
});

app.get('/', function(req, res){
	res.render('index.html');
});

app.get('/begin', function(req, res) {
	ensureUser(req);


	var battle = makeBattle(getUser(req));
	console.log('made battle: ' + battle.id);

	res.redirect('/' + battle.id);
});

app.get('/:id', function(req, res) {
	var battle = battles[req.params.id];

	if (!battle) {
		res.send('BATTLE NO EXIST IDIOT', 404);
		return;
	}

	var user = getUser(req);

	var isInBattle = battle.users.filter(function(u) { 
			return u.id === user.id; 
		}).length > 0;

	if (battle.state !== 'waiting' && !isInBattle) {
		res.send('TOOO LATE TO JOIN THAT BATTLE SON', 404);
		return;
	}

	res.render('battle.html', {
		userDetails: user
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

		var alreadyPlaying = battle.users.some(function(u) {
			return u.id === user.id;
		});

		if (!alreadyPlaying) {
			// Tell other people that we've got someone connected
			battle.sockets.forEach(function(otherSocket) {
				otherSocket.emit('starting-something', {
					user: data.user
				});
			});
			// Add this user to the current users collection
			battle.users.push(data.user);
		}

		battle.sockets.push(socket);

		// Let the user know the details of the battle
		socket.emit('bring-it', {
			users: battle.users,
			leader: battle.leader,
			state: battle.state
		});
	});

	socket.on('kick-off', function() {
		battle.state = 'fighting';
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

	socket.on('winning', function(data) {
		data.user = user;
		battle.sockets.forEach(function(socket) {
			socket.emit('game-over', data);
		});
	});
});

app.listen(3000);
