define('battle/session', function() {
	
	function Session(options) {
		var socket = io.connect(),
			bus = options.bus,
			me = options.user,
			subs = [],
			challenge = {
				id: options.challengeId,
				users: []
			};

		function sub(topic, fn) {
			subs.push(bus.sub(topic, fn));
		}

		// Global error handler
		socket.on('bugger-off', function(data) {
			alert('UR BACKEND ERRORD: ' + data.message);
		});

		socket.on('starting-something', function(data) {
			challenge.users.push(data.user);
			bus.pub('new-user', data);
		});

		sub('kick-off', function() {
			socket.emit('kick-off');
		});

		sub('attack', function(data) {
			socket.emit('attack', data);
		});

		socket.on('attacked', function(data) {
			bus.pub('attacked', data);
		});

		socket.on('its-kicking-off', function() {
			bus.pub('its-kicking-off',{
				challenge: challenge,
				user: me	
			});
		});

		socket.once('bring-it', function(data) {
			([]).push.apply(challenge.users, data.users);
			challenge.leader = data.leader;

			bus.pub('waiting', {
				challenge: challenge,
				user: me
			});
		});

		socket.emit('talking-shit', {
			challengeId: challenge.id,
			user: options.user
		});
	}

	return Session;
});
