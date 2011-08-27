define('battle/waitingRoomView', ['text!./waitingRoomView.html'], function(tmpl) {
	var WaitingRoomView = Backbone.View.extend({
		events: {
			'click .start': 'start'
		},
		initialize: function() {
			var content = $(tmpl),
				usersEl = content.find('ul');
			
			this.el.children().remove();

			function addUser(data) {
				$('<li>').text(data.user).appendTo(usersEl);
			}

			this.options.users.forEach(function(user) {
				addUser({ user: user });
			});

			// Only allow the leader to start matches
			if (this.options.leader !== this.options.user) {
				content.find('.start').hide();	
			}
			
			this.el.append(content);

			this.options.socket.on('starting-something', addUser);
			this.unsubAddUser = function() {
				this.options.socket.removeListener('starting-something', addUser);
			};
		},
		start: function() {
			this.options.socket.emit('kick-off');
		},
		remove: function() {
			this.el.children().remove();
			this.unsubAddUser();
		}
	});	

	return WaitingRoomView;
});
