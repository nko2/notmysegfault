define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle', 'cjs!challenges/word_count'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle, challenge) {

		var FightingView = Backbone.View.extend({
			initialize: function() {
				var bus = this.options.bus,
					editor, session;

				var fightingEl = $(tmpl).tmpl(this.options.challenge);
				this.fightingEl = fightingEl;
				
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
				
				bus.sub('attacked', $.proxy(function(data) {
					this.updateUser.call(this, data);
				}, this));

				editor = ace.edit(editorEl[0]);
				session = editor.getSession();

				editor.setKeyboardHandler(new hashHandler.HashHandler({
					submit: 'Ctrl-Return'
				}));
				session.setMode(new JavaScriptMode.Mode());
				session.setValue('');
				
				Battle.init({
					challenge: challenge,
					editorSession: session
				});
				
				$('#challenge-name').text(challenge.name);
				$('#challenge-description').text(challenge.description);
			},
			
			remove: function() {
				this.el.children().remove();
			},
			
			updateUser: function(testResults){
				var numPassed = testResults.total - testResults.failed;
				
				this.fightingEl.find('[data-user-id=' + testResults.user.id + '] .num-tests-passing').text(numPassed);
				$('.num-tests').text(testResults.total);
			}
		});

		return FightingView;
	}
);
