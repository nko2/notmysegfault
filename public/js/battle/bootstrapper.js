define('battle/bootstrapper', 
		[ './bus', './session', './shell' ], 
		function(Bus, Session, Shell) {

			console.log('shell', Shell);

	return {
		init: function(options) {
			var challengeId = window.location.pathname.slice(1),
				bus = new Bus(),
				session = new Session({
					bus: bus,
					challengeId: challengeId,
					user: options.session.user
				}),
				shell = new Shell({
					el: options.el,
					bus: bus
				});
		}
	};

});
