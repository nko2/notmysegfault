define('battle/fightingView',
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler', 'text!./fightingView.html', 'battle', 'ace/theme/idle_fingers'], 
	function(ace, JavaScriptMode, canon, hashHandler, tmpl, Battle, idleFingersTheme) {

		var FightingView = Backbone.View.extend({
			bus: undefined,
			currentUser: undefined,
			editor: undefined,
			session: undefined,
			testTimer: undefined,
			
			initialize: function() {
				var self = this,
					bus = this.options.bus,
					currentUser = this.options.user,
					challenge = this.options.challenge,
					setup = challenge.setup,
					initialValue = (setup.initialValue && setup.initialValue()) || "// Type your solution here.",
					editor, session,
					errorListEl;
				
				initialValue += "\n// Tests are run automatically."
				
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

				bus.sub('user-fucked-off', function(data) {
					fightingEl.find('[data-user-id=' + data.user.id + ']').hide('fast', function() {
						$(this).remove();
					});
				});
				
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
				editor.setTheme(idleFingersTheme);
				session.setValue(initialValue);
				editor.setFontSize('14px');
				
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
				
				// run tests after the user is idle
				session.on('change', _.debounce($.proxy(this.runTests, this), 500));
			},
			
			remove: function() {
				this.el.children().remove();
			},
			
			runTests: function(){
				try{
					Battle.runTests( $.proxy(this.onTestsComplete, this) );
				} catch (e) { 
					this.onTestsErrord(e, this); 
				}
			},

			onTestsErrord: function(error) {
				this.$errorList.children().remove();

				var name = $('<span>').text('Unable to run tests').addClass('test'),
					message = $('<span>').text(error.message).addClass('error');

				$('<li>').append(name).append(message).appendTo(this.$errorList);

				this.editor.resize();
			},
			
			onTestsComplete: function(results){
				this.updateUser(this.currentUser, results);
				
				if (results.failures.length === 0) {
					this.bus.pub('winning', {
						code: this.session.getValue()
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
