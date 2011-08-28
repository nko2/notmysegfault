define('battle', [], function(){
	return {
		challenge: undefined,
		$codeInput: undefined,
		editorSession: undefined,
		testTimer: undefined,
	
		init: function(options){
			var challenge = options.challenge,
				setup = challenge.setup,
				preCode = setup.preCode,
				postCode = setup.postCode;

			this.challenge = challenge;
			this.editorSession = options.editorSession;
		
			var $codeInput = $('#editor');
			this.$codeInput = $codeInput;

			if (preCode) {
				$codeInput.before('<pre>' + preCode + '</pre');
			}

			if (postCode) {
				$codeInput.after('<pre>' + postCode + '</pre>');
			}
		},
	
		runTests: function(callback){
			var challenge = this.challenge,
				setup = challenge.setup,
				preCode = setup.preCode || '',
				postCode = setup.postCode || '',
				code = preCode + this.editorSession.getValue() + postCode,
				results = {
					total: 0,
					failures: []	
				},
				contextBoundTests = {},
				context = (setup.setup && setup.setup()) || {};

			$.globalEval(code);

			Object.keys(challenge.tests).forEach(function(n) {
				var originalTest = challenge.tests[n];

				contextBoundTests[n] = function(test) {
					originalTest(test, context);
				};
			});
		
			nodeunit.runModule(
				challenge.name,
				contextBoundTests,
				{ 
					testDone: function(names, assertions) {
						// I don't know why names is an array
						var name = names[0],
							failures = assertions.filter(function(a) {
								return a.failed();
							});

						results.total = results.total + 1;
						
						if (failures.length) {
							results.failures.push({
								name: name,
								message: failures[0].message
							});
						}
					}
				},
				function(){callback(results);}
			);
		}
	};
});
