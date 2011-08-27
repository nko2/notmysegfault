define('battle', [], function(){
	return {
		challenge: undefined,
		$codeInput: undefined,
		testTimer: undefined,
	
		init: function(options){
			var challenge = options.challenge;
			this.challenge = challenge;
		
			$('#challenge-name').text(challenge.name);
			$('#challenge-description').text(challenge.description);
		
			var $codeInput = $('#code-input');
			this.$codeInput = $codeInput;
			$codeInput.before('<div>' + challenge.preCode + '</div');
			$codeInput.after('<div>' + challenge.postCode + '</div>');
			$codeInput.change( $.proxy(this.runTests, this) );
			$codeInput.keypress( $.proxy(this.onKeypress, this) );
		},
	
		runTests: function(callback){
			var code = this.challenge.preCode + this.$codeInput.val() + this.challenge.postCode;
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
