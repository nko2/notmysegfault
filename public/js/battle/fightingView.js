define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle', 'cjs!challenges/word_count'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle, challenge) {

		var FightingView = Backbone.View.extend({
			initialize: function() {
				var bus = this.options.bus, 
					editor, session;

				var fightingEl = $(tmpl).tmpl(this.options.challenge);
				
				fightingEl.appendTo(this.el);

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

				bus.sub('attacked', function(data) {
					var passed = data.total - data.failed,
						text = '(' + passed + '/' + data.total + ')';
					
					fightingEl.find('li[data-user=' + data.user + '] .winningness').text(text);
				});

				editor = ace.edit(editorEl[0]);
				session = editor.getSession();

				editor.setKeyboardHandler(new hashHandler.HashHandler({
					submit: 'Ctrl-Return'
				}));
				session.setMode(new JavaScriptMode.Mode());
				session.setValue('');
				
				Battle.init(challenge);
			}
		});

		return FightingView;
	}
);
