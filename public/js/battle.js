var Battle = {
	challenge: undefined,
	$codeInput: undefined,
	
	init: function(challenge){
		this.challenge = challenge;
		
		var $codeInput = $('#code-input');
		this.$codeInput = $codeInput;
		$codeInput.val(challenge.initialCode);
		$codeInput.blur( $.proxy(this.runTests, this) );
	},
	
	runTests: function(){
		$.globalEval(this.$codeInput.val());
		
		nodeunit.runModule(
			this.challenge.name,
			this.challenge.tests,
			{ moduleDone: this.onTestsComplete },
			function(){}
		);
	},
	
	onTestsComplete: function(name, assertions){
		console.log("you have " + assertions.failures() + " failures.");
	}
};

require(['cjs!challenges/word_count'], function(wordCount){
	Battle.init(wordCount);
});
