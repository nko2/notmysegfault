define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl) {

		var FightingView = Backbone.View.extend({
			initialize: function() {
				var editor, session;

				$(tmpl).tmpl(this.options.challenge).appendTo(this.el);

				editorEl = $('#ace-host');

				canon.addCommand({
					name:'submit',
					exec: function() {
						var challenge = new FizzBuzz(),
							js = session.getValue(),
							results;
						
						challenge.setup();
						eval(js);
						results = run(challenge.verify);

						console.log(results);
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
