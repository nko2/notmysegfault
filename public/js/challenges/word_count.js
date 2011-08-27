exports.name = "Word Count";

exports.description = "Return the number of words in the given string.  Words are separated by whitespace.";

exports.initialCode = "function wordCount(inputStr){\n  \n}";

exports.tests = {
	emptyString: function(test){
		test.expect(3);
		test.equal(typeof wordCount, 'function', "wordCount() is not defined");
		
		var result = wordCount('');
		test.equal(typeof result, 'number', "you must return a number");
		test.equal(result, 0, "the result should be 0");
		test.done();
	},
	
	singleWord: function(test){
		test.expect(3);
		test.equal(typeof wordCount, 'function', "wordCount() is not defined");
		
		var result = wordCount('foo');
		test.equal(typeof result, 'number', "you must return a number");
		test.equal(result.length, 1, "the result should be one");
		test.done();
	},
	
	singleWordWithSpaces: function(test){
		test.expect(3);
		test.equal(typeof wordCount, 'function', "wordCount() is not defined");
		
		var result = wordCount(' foo ');
		test.equal(typeof result, 'number', "you must return a number");
		test.equal(result.length, 1, "the result should be one");
		test.done();
	}
};
