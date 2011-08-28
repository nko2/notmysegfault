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
		
			$('#challenge-name').text(challenge.name);
			$('#challenge-description').text(challenge.description);
		
			var $codeInput = $('#workbench');
			this.$codeInput = $codeInput;
			$codeInput.before('<pre>' + challenge.preCode + '</pre');
			$codeInput.after('<pre>' + challenge.postCode + '</pre>');
			// $codeInput.change( $.proxy(this.runTests, this) );
			// $codeInput.keypress( $.proxy(this.onKeypress, this) );
		},
	
		runTests: function(callback){
			var code = this.challenge.preCode + this.editorSession.getValue() + this.challenge.postCode;
			$.globalEval(code);
		
			nodeunit.runModule(
				this.challenge.name,
				this.challenge.tests,
				{ moduleDone: $.proxy(callback, this) },
				function(){}
			);
		},
		
		onKeypress: function(){
			if (this.testTimer){
				window.clearTimeout(this.testTimer);
			}
			this.testTimer = window.setTimeout( $.proxy(this.runTests, this), 3000);
		}
	};
});
