var express = require('express'),
	everyauth = require('everyauth'),
	fs = require('fs'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

['GITHUB_ID', 'GITHUB_SECRET', 'SESSION_SECRET'].forEach(function(name){
	if ( ! process.env[name] ) {
		throw new Error("I need a " + name + " environment variable.");
	}
});

everyauth.everymodule.moduleErrback(function (err) {
	console.log('authentication error: ' + err);
});
everyauth.github
	.appId(process.env.GITHUB_ID)
	.appSecret(process.env.GITHUB_SECRET)
	.handleAuthCallbackError(function(req, res){
		res.end('bad');
	})
	.findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
		// everyauth doesn't appear to do anything with the result of this function.
		// https://github.com/bnoguchi/everyauth/issues/60
		return {};
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
				lobby.add(battle);

				return battle;
			};
		})();
function ensureUser(req, res, next) {
	if (req.user) {
		next();
	} else {
		req.session.returnTo = req.url;
		res.redirect('/auth/github');
		return;
	}
}

var challenges = (function() {
	var files	= fs.readdirSync('./public/js/challenges'),
		namePattern = /^([a-zA-Z0-9]+)\./,
		challenges = {};

	files.forEach(function(file) {
		var challengeNameMatch = namePattern.exec(file),
			name;

		if (challengeNameMatch) {
			name = challengeNameMatch[1];
			challenges[name] = name;
		}
	});

	return Object.keys(challenges);
})();

app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({
	secret: process.env.SESSION_SECRET
}));
app.use(everyauth.middleware());
// Make user info more accessible
app.use(function(req, res, next){
	var user;
	if (user = req.session && req.session.auth && req.session.auth.github && req.session.auth.github.user){
		req.user = {
			id: user.id,
			login: user.login,
			gravatar: user.gravatar_id,
		};
	}
	next();
});
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
		return req.user;
	}
});

app.get('/', function(req, res){
	if (req.session && req.session.returnTo) {
		var returnTo = req.session.returnTo;
		delete req.session.returnTo;
		res.redirect(returnTo);
		return;
	}
	res.render('index.html');
});

app.get('/begin', ensureUser, function(req, res) {

	var battle = makeBattle(req.user);
	console.log('made battle: ' + battle.id);

	res.redirect('/' + battle.id);
});

app.get('/:id', ensureUser, function(req, res) {
	var battle = battles[req.params.id];

	if (!battle) {
		res.send('BATTLE NO EXIST IDIOT', 404);
		return;
	}

	var isInBattle = battle.users.filter(function(u) { 
			return u.id === req.user.id;
		}).length > 0;

	if (battle.state !== 'waiting' && !isInBattle) {
		res.send('TOOO LATE TO JOIN THAT BATTLE SON', 404);
		return;
	}

	res.render('battle.html');
});

function failSocket(socket, message) {
	socket.emit('bugger-off', {
		message: message
	});
}

io.of('/battle').on('connection', function(socket) {
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
			lobby.update(battle);
		}

		battle.sockets.push(socket);

		// Let the user know the details of the battle
		socket.emit('bring-it', {
			users: battle.users,
			leader: battle.leader,
			state: battle.state,
			challengeName: battle.challengeName
		});
	});

	socket.on('kick-off', function() {
		battle.state = 'fighting';
		battle.challengeName = challenges[Math.floor(challenges.length * Math.random())];

		lobby.update(battle);
		battle.sockets.forEach(function(socket) {
			socket.emit('its-kicking-off', {
				challengeName: battle.challengeName
			});
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
		battle.state = 'over';
		lobby.destroy(battle);
	});
});

var lobby = new (function(){
	function prepBattle(battle){
		return {
			id: battle.id,
			leader: battle.leader,
			state: battle.state,
			users: battle.users
		};
	}

	function Lobby(){
		this.sockets = io.of('/lobby')
			.on('connection', function(socket){
				var battleArray = [];
				for (var key in battles) {
					if (battles[key].state !== 'over') {
						battleArray.push(prepBattle(battles[key]));
					}
				}
				socket.emit('refresh', battleArray);
			});
	}
	Lobby.prototype.update = function(battle){
		this.sockets.emit('update', prepBattle(battle));
	}
	Lobby.prototype.add = function(battle){
		this.sockets.emit('add', prepBattle(battle));
	}
	Lobby.prototype.destroy = function(battle){
		this.sockets.emit('destroy', battle.id);
	}
	return Lobby;
}());

app.listen(3000);
