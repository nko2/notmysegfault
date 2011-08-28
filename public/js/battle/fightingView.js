define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle) {

		var FightingView = Backbone.View.extend({
			bus: undefined,
			currentUser: undefined,
			editor: undefined,
			session: undefined,
			
			initialize: function() {
				var self = this,
					bus = this.options.bus,
					currentUser = this.options.user,
					challenge = this.options.challenge,
					editor, session,
					errorListEl;

				this.currentUser = currentUser;
				this.bus = bus;

				var fightingEl = $(tmpl).tmpl(this.options.challenge);
				this.fightingEl = fightingEl;
				
				fightingEl.appendTo(this.el);
				
				this.$errorList = this.el.find('.errors ul');

				canon.addCommand({
					name:'submit',
					exec: $.proxy(this.runTests, this)
				});
				
				bus.sub('attacked', $.proxy(function(data) {
					this.updateUser(data.user, data);
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
				
				// initialize scores
				this.runTests();
				
				var markdown = challenge.description,
						converter = new Showdown.converter(),
						markup = converter.makeHtml(markdown);

				this.el.find('#info').html(markup);
			},
			
			remove: function() {
				this.el.children().remove();
			},
			
			runTests: function(){
				Battle.runTests( $.proxy(this.onTestsComplete, this) );
			},
			
			onTestsComplete: function(results){
				this.updateUser(this.currentUser, results);
				
				if (results.failures.length === 0) {
					this.bus.pub('winning', {
						code: session.getValue()
					});
				} else {
					this.$errorList.children().remove();

					for (var i = 0; i < results.failures.length; i++){
						var failure = results.failures[i],
							name = $('<span>').text(failure.name).addClass('test'),
							message = $('<span>').text(failure.message).addClass('error');

						$('<li>').append(name).append(message).appendTo(this.$errorList);
					}

					this.editor.resize();

					this.bus.pub('attack', {
						total: results.total,
						failures: results.failures
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
