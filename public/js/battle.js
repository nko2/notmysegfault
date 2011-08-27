var Battle = {
	challenge: undefined,
	$codeInput: undefined,
	testTimer: undefined,
	
	init: function(challenge){
		this.challenge = challenge;
		
		var $codeInput = $('#code-input');
		this.$codeInput = $codeInput;
		$codeInput.before('<div>' + challenge.preCode + '</div');
		$codeInput.after('<div>' + challenge.postCode + '</div>');
		$codeInput.blur( $.proxy(this.runTests, this) );
		$codeInput.keypress( $.proxy(this.onKeypress, this) );
	},
	
	runTests: function(){
		var code = this.challenge.preCode + this.$codeInput.val() + this.challenge.postCode;
		$.globalEval(code);
		
		nodeunit.runModule(
			this.challenge.name,
			this.challenge.tests,
			{ moduleDone: this.onTestsComplete },
			function(){}
		);
	},
	
	onKeypress: function(){
		if (this.testTimer){
			window.clearTimeout(this.testTimer);
		}
		this.testTimer = window.setTimeout( $.proxy(this.runTests, this), 3000);
	},
	
	onTestsComplete: function(name, assertions){
		console.log("you have " + assertions.failures() + " failures.");
	}
};

require(['cjs!challenges/word_count'], function(challenge){
	Battle.init(challenge);
});
