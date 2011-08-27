			require(
				['ace/ace', 'ace/mode/javascript', 'pilot/canon', 'ace/keyboard/hash_handler'], 
				function(ace, JavaScriptMode, canon, hashHandler) {
					var editor, session;

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

					showChallenge();
				}
			);
