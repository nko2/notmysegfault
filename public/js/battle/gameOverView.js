define('battle/gameOverView', [ 'text!./gameOverView.html' ], function(tmpl) {

	var GameOverView = Backbone.View.extend({
		initialize: function() {
			var gameOverViewEl = $(tmpl).tmpl(this.options);

			this.el.append(gameOverViewEl);
		}
	});

	return GameOverView;
});
