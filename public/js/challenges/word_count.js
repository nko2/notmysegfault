exports.name = "Word Count";

exports.description = "Return the number of words in the given string.  Words are separated by whitespace.";

exports.preCode = "function wordCount(inputStr){";
exports.postCode = "}";

exports.tests = {
	whenCalledWithAnEmptyString: function(test){
		var result = wordCount('');
		test.equal(result, 0, "Expected an empty string to return 0 but got " + result + ".");
		test.done();
	},
	
	whenCalledWithASingleWord: function(test){
		var result = wordCount('foo');
		test.equal(result, 1, 'Expected "foo" to return 1 but got ' + result + ".");
		test.done();
	},
	
	whenCalledWithAWordWithSpaces: function(test){
		var result = wordCount(' foo ');
		test.equal(result, 1, 'Expected "  foo  " to return 1 but got ' + result + '.');
		test.done();
	}
};
