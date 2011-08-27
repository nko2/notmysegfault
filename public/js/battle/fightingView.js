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
						Battle.runTests(function(name, assertions){
							var testResults = {
								total: assertions.length,
								failed: assertions.failures()
							};

							if (testResults.failed === 0) {
								bus.pub('winning', {
									code: session.getValue()
								});
							} else {
								bus.pub('attack', testResults);
							}
						});
					}
				});

				bus.sub('attacked', function(data) {
					var passed = data.total - data.failed;
					
					fightingEl.find('[data-user=' + data.user + '] .num-tests-passing').text(passed);
					$('.num-tests').text(data.total);
				});

				editor = ace.edit(editorEl[0]);
				session = editor.getSession();

				editor.setKeyboardHandler(new hashHandler.HashHandler({
					submit: 'Ctrl-Return'
				}));
				session.setMode(new JavaScriptMode.Mode());
				session.setValue('');
				
				Battle.init({
					challenge: challenge
				});
			},
			remove: function() {
				this.el.children().remove();
			}
		});

		return FightingView;
	}
);
