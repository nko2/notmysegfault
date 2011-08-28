define('battle', [], function(){
	return {
		challenge: undefined,
		$codeInput: undefined,
		editorSession: undefined,
		testTimer: undefined,
	
		init: function(options){
			var challenge = options.challenge;
			this.challenge = challenge;
			this.editorSession = options.editorSession;
		
			var $codeInput = $('#workbench');
			this.$codeInput = $codeInput;
			$codeInput.before('<pre>' + challenge.setup.preCode + '</pre');
			$codeInput.after('<pre>' + challenge.setup.postCode + '</pre>');
		},
	
		runTests: function(callback){
			var challenge = this.challenge,
				setup = challenge.setup,
				code = setup.preCode + this.editorSession.getValue() + setup.postCode,
				results = {
					total: 0,
					failures: []	
				};

			$.globalEval(code);
		
			nodeunit.runModule(
				challenge.name,
				challenge.tests,
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
