define('battle/shell',
		['./waitingRoomView', './fightingView', '../battle', './gameOverView' ], 
		function(WaitingRoomView, FightingView, Battle, GameOverView) {
			
			function Shell(options) {
				this.bus = options.bus;
				this.currentView = null;
				this.el = options.el;
				this.subs = [];
				
				this.bus.sub('waiting', this.waiting.bind(this));
				this.bus.sub('its-kicking-off', this.kickOff.bind(this));
				this.bus.sub('game-over', this.gameOver.bind(this));
			}

			Shell.prototype.waiting = function(data) {
				var waitingRoomView = this.currentView = new WaitingRoomView({
					el: this.el,
					bus: this.bus,
					challenge: data.challenge,
					user: data.user
				});
			}

			Shell.prototype.kickOff = function(data) {
				if (this.currentView) {
					this.currentView.remove();
				}

				var fightingView = this.currentView = new FightingView({
					el: this.el,
					bus: this.bus,
					challenge: data.challenge,
					user: data.user
				});
			}

			Shell.prototype.gameOver = function(data) {
				if (this.currentView) {
					this.currentView.remove();
				}

				var gameOverView = new GameOverView($.extend({
					el: this.el,
					bus: this.bus,
				}, data));
			};

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
