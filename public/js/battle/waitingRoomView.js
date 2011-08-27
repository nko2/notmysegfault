define('battle/waitingRoomView', ['text!./waitingRoomView.html'], function(tmpl) {
	var WaitingRoomView = Backbone.View.extend({
		initialize: function() {
			var content = $(tmpl);
			
			this.el.children().remove();
			
			this.el.append(content);
		}
	});	

	return WaitingRoomView;
});
