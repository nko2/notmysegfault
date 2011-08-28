define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle', 'cjs!challenges/word_count'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle, challenge) {

		var FightingView = Backbone.View.extend({
			bus: undefined,
			currentUser: undefined,
			editor: undefined,
			session: undefined,
			
			initialize: function() {
				this.bus = this.options.bus;
				this.currentUser = this.options.user;
				
				var fightingEl = $(tmpl).tmpl(this.options.challenge);
				this.fightingEl = fightingEl;
				
				fightingEl.appendTo(this.el);
				
				this.$errorList = this.el.find('.errors ul');

				canon.addCommand({
					name:'submit',
					exec: $.proxy(this.runTests, this)
				});
				
				this.bus.sub('attacked', $.proxy(function(data) {
					this.updateUser.call(this, data.user, data);
				}, this));
				
				var $editor = $('#ace-host'),
					editor = ace.edit($editor[0]),
					session = editor.getSession();
				
				this.editor = editor;
				this.session = session;
				
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
				
				this.runTests();
				
				$('#challenge-name').text(challenge.name);
				$('#challenge-description').text(challenge.description);
			},
			
			remove: function() {
				this.el.children().remove();
			},
			
			runTests: function(){
				Battle.runTests( $.proxy(this.onTestsComplete, this) );
			},
			
			onTestsComplete: function(results){
				this.updateUser.call(this, this.currentUser, results);
				
				if (results.failures.length === 0) {
					this.bus.pub('winning', {
						code: session.getValue()
					});
				} else {
					this.$errorList.children().remove();

					results.failures.forEach(function(failure) {
						var name = $('<span>').text(failure.name).addClass('test'),
							message = $('<span>').text(failure.message).addClass('error');

						$('<li>').append(name).append(message).appendTo(this.$errorList);
					});

					this.editor.resize();

					this.bus.pub('attack', {
						total: results.total,
						failed: results.failures.length
					});
				}
			},
			
			updateUser: function(user, testResults){
				var numPassed = testResults.total - testResults.failures.length;
				
				this.fightingEl.find('[data-user-id=' + user.id + '] .num-tests-passing').text(numPassed);
				$('.num-tests').text(testResults.total);
			}
		});

		return FightingView;
	}
);
