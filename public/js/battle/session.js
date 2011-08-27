define('battle/session', function() {
	
	function Session(options) {
		var socket = io.connect(),
			bus = options.bus,
			me = options.user,
			challenge = {
				id: options.challengeId,
				users: []
			};

		// Global error handler
		socket.on('bugger-off', function(data) {
			alert('UR BACKEND ERRORD: ' + data.message);
		});

		socket.on('starting-something', function(data) {
			bus.pub('new-user', data);
		});

		socket.once('bring-it', function(data) {
			([]).push.apply(challenge.users, data.users);
			challenge.leader = data.leader;

			bus.pub('waiting', {
				challenge: challenge,
				user: me
			});
		});

		socket.once('its-kicking-off', function() {
			alert('its-kicking-off');
		});

		socket.emit('talking-shit', {
			challengeId: challenge.id,
			user: options.user
		});
	}

	return Session;
});
