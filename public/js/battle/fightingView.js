define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl) {

		var FightingView = Backbone.View.extend({
			initialize: function() {
				var bus = this.options.bus, 
					editor, session;

				$(tmpl).tmpl(this.options.challenge).appendTo(this.el);

				editorEl = $('#ace-host');

				canon.addCommand({
					name:'submit',
					exec: function() {
						var testResults = {
							total: 10,
							failed: 10 - Math.ceil(Math.random() * 8)
						};

						bus.pub('attack', testResults);
					}
				});

				editor = ace.edit(editorEl[0]);
				session = editor.getSession();

				editor.setKeyboardHandler(new hashHandler.HashHandler({
					submit: 'Ctrl-Return'
				}));
				session.setMode(new JavaScriptMode.Mode());
				session.setValue('');
			}
		});

		return FightingView;
	}
);
