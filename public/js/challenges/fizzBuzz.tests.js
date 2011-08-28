exports['there should have been 100 messages printed'] = function(test, context) {
	test.equal(context.results.length, 100, 'Expected 100 messages but found ' + context.results.length + '.');
	test.done();
};
