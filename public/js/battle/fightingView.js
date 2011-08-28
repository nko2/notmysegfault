define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle', 'cjs!challenges/word_count'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle, challenge) {

		var FightingView = Backbone.View.extend({
			initialize: function() {
				var self = this,
					bus = this.options.bus,
					currentUser = this.options.user,
					editor, session;

				var fightingEl = $(tmpl).tmpl(this.options.challenge);
				this.fightingEl = fightingEl;
				
				fightingEl.appendTo(this.el);

				editorEl = $('#ace-host');

				canon.addCommand({
					name:'submit',
					exec: function() {
						Battle.runTests(function(results){
							results.failures.forEach(function(failure) {
								console.log(failure.name, ': ', failure.message);
							});

							self.updateUser.call(self, currentUser, results);
							
							if (results.failures.length === 0) {
								bus.pub('winning', {
									code: session.getValue()
								});
							} else {
								bus.pub('attack', {
									total: results.total,
									failed: results.failures.length
								});
							}
						});
					}
				});
				
				bus.sub('attacked', $.proxy(function(data) {
					this.updateUser.call(this, data.user, data);
				}, this));

				editor = ace.edit(editorEl[0]);
				session = editor.getSession();
				
				editor.setShowPrintMargin(false);
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
			
			updateUser: function(user, testResults){
				var numPassed = testResults.total - testResults.failed;
				
				this.fightingEl.find('[data-user-id=' + user.id + '] .num-tests-passing').text(numPassed);
				$('.num-tests').text(testResults.total);
			}
		});

		return FightingView;
	}
);
