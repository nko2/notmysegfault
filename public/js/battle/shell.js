define('battle/shell', 
		['./waitingRoomView', './fightingView'], 
		function(WaitingRoomView, FightingView) {
			
			function Shell(options) {
				this.bus = options.bus;
				this.currentView = null;
				this.el = options.el;
				this.subs = [];
				
				this.bus.sub('waiting', this.waiting.bind(this));
			}

			Shell.prototype.waiting = function(data) {
				var waitingRoomView = new WaitingRoomView({
					el: this.el,
					bus: this.bus,
					challenge: data.challenge,
					user: data.user
				});
			}

			Shell.prototype.sub = function(topic, fn) {
				var unsub = this.bus.sub(topic, fn.bind(this));

				this.subs.push(unsub);
			}

			Shell.prototype.remove = function() {
				if (this.currentView) {
					this.currentView.remove();
				}

				this.subs.forEach(function(unsub) { unsub(); });
			}

			return Shell;

		}
);
