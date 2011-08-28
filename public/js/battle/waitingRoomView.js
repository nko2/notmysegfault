define('battle/waitingRoomView', 
	['text!./waitingRoomView.html', 'text!./waitingRoomView.user.html' ], 
	function(tmpl, userTmpl) {
		var WaitingRoomView = Backbone.View.extend({
			events: {
				'click .start': 'start'
			},
			initialize: function() {
				var content = $(tmpl),
					challenge = this.options.challenge,
					usersEl = content.find('ul');
				
				this.unsubs = [];
				this.bus = this.options.bus;
				this.el.children().remove();

				function addUser(data, animate) {
					var el = $(userTmpl).tmpl(data.user);

					if (animate) {
						el.hide().appendTo(usersEl).show('fast');
					} else {
						el.appendTo(usersEl);
					}
				}

				challenge.users.forEach(function(user) {
					addUser({ user: user }, false);
				});

				this.unsubs.push(this.bus.sub('new-user', function(data) {
					addUser(data, true);
				}));

				this.unsubs.push(this.bus.sub('user-fucked-off', function(data) {
					// Remove the user element
					usersEl.find('li[data-user-id=' + data.user.id + ']').hide('fast', function() {
						$(this).remove();	
					});
				}));

				// Only allow the leader to start matches
				if (challenge.leader.id !== this.options.user.id) {
					content.find('.start').hide();	
				}

				// Set the location so they can share
				content.find('.url').val(window.location.toString());
				
				this.el.append(content);
			},
			start: function() {
				this.options.bus.pub('kick-off');
			},
			remove: function() {
				this.el.children().remove();
				this.unsubs.forEach(function(unsub) { unsub(); });
			}
		});	

		return WaitingRoomView;
	}
);
