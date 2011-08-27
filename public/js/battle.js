var Battle = {
	challenge: undefined,
	$codeInput: undefined,
	$numPassing: undefined,
	$numTests: undefined,
	testTimer: undefined,
	
	init: function(challenge){
		this.challenge = challenge;
		
		$('#challenge-name').text(challenge.name);
		$('#challenge-description').text(challenge.description);
		
		var $codeInput = $('#code-input');
		this.$codeInput = $codeInput;
		$codeInput.before('<div>' + challenge.preCode + '</div');
		$codeInput.after('<div>' + challenge.postCode + '</div>');
		$codeInput.change( $.proxy(this.runTests, this) );
		$codeInput.keypress( $.proxy(this.onKeypress, this) );
		
		this.$numPassing = $('.num-tests-passing');
		this.$numTests = $('.num-tests');
		
		// get initial results
		this.runTests();
	},
	
	runTests: function(){
		var code = this.challenge.preCode + this.$codeInput.val() + this.challenge.postCode;
		$.globalEval(code);
		
		nodeunit.runModule(
			this.challenge.name,
			this.challenge.tests,
			{ moduleDone: $.proxy(this.onTestsComplete, this) },
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
		var numTests = assertions.length,
			numPassed = numTests - assertions.failures();
		
		this.$numTests.text(numTests);
		this.$numPassing.text(numPassed);
	}
};

require(['cjs!challenges/word_count'], function(challenge){
	$(function(){
		Battle.init(challenge);
	});
});
