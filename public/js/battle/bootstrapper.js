define('battle/bootstrapper', [ './waitingRoomView', './fightingView' ], function(WaitingRoomView, FightingView) {

	return {
		init: function(options) {
			var challengeId = window.location.pathname.slice(1),
				socket = io.connect(),
				currentView;

			// Global error handler
			socket.on('bugger-off', function(data) {
				alert('UR BACKEND ERRORD: ' + data.message);
			});

			socket.once('bring-it', function(data) {
				var waitingRoomView = currentView = new WaitingRoomView({
					el: options.el,
					challengeId: challengeId,
					users: data.users,
					user: options.session.user,
					leader: data.leader,
					socket: socket
				});
			});

			socket.once('its-kicking-off', function() {
				currentView.remove();
				var fightingView = currentView = new FightingView({
					el: options.el,
					challengeId: challengeId,
					users: data.users,
					socket: socket
				});
			});

			socket.emit('talking-shit', {
				challengeId: challengeId,
				user: options.session.user
			});
		}
	};

});
