exports['when called with a empty string'] = function(test){
	var result = wordCount('');
	test.equal(result, 0, "Expected an empty string to return 0 but got " + result + ".");
	test.done();
};

exports['when called with a single word'] = function(test){
	var result = wordCount('foo');
	test.equal(result, 1, 'Expected "foo" to return 1 but got ' + result + ".");
	test.done();
};

exports['when called with a word with spaces'] = function(test){
	var result = wordCount(' foo ');
	test.equal(result, 1, 'Expected "  foo  " to return 1 but got ' + result + '.');
	test.done();
};

exports['undefined has no words'] = function(test) {
	var result = wordCount();
	test.equal(result, 0, 'Expected undefined to be 0 but got ' + result  + '.');
	test.done();
};

exports['null has no words'] = function(test) {
	var result = wordCount(null);
	test.equal(result, 0, 'Expected null to be 0 but got ' + result  + '.');
	test.done();
};

exports['mutiple words return correct values'] = function(test) {
	var result = wordCount('Hello World');
	test.equal(result, 2, 'Expected "Hello World" to be 2 but got ' + result  + '.');
	test.done();
};

exports['can cope with full sentences'] = function(test) {
	var result = wordCount('This is a full sentence. This is another.');
	test.equal(result, 8, 'Expected "This is a full sentence. This is another." to be 8 but got ' + result + '.');
	test.done();
};

exports['hyphens are considered part of a word'] = function(test) {
	var result = wordCount('I code on-the-fly. Oh yeah.');

	test.equal(result, 5, 'Expected "I code on-the-fly. Oh yeah." to be 5 but got ' + result + '.');
	test.done();
};
