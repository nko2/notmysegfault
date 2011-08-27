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

		socket.once('bring-it', function(data) {
			bus.pub('waiting', {
				users: data.users,
				me: me,
				leader: data.leader
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
