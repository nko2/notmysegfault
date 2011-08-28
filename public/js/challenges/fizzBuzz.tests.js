exports['there should have been 100 messages written'] = function(test, context) {
	test.equal(context.results.length, 100, 'Expected 100 messages but found ' + context.results.length + '.');
	test.done();
};

exports['writes numbers'] = function(test, context) {
	var actual;

	for (var i = 1; i <= 100; i++) {
		actual = context.results[i - 1];
		if (i % 3 !== 0 && i % 5 !== 0) {
			test.equal(i, actual, 'Expected ' + i + ' but found ' + actual + '.');
		}
	}

	test.done();
};

exports['writes Fizz for multiples of 3'] = function(test, context) {
	var actual;

	for (var i = 1; i <= 100; i++) {
		actual = context.results[i - 1];
		if (i % 3 === 0 && i % 5 !== 0) {
			test.equal('Fizz', actual, 'Expected "Fizz" but found ' + actual + '.');
		}
	}

	test.done();
};

exports['writes Buzz for multiples of 5'] = function(test, context) {
	var actual;

	for (var i = 1; i <= 100; i++) {
		actual = context.results[i - 1];
		if (i % 3 !== 0 && i % 5 === 0) {
			test.equal('Buzz', actual, 'Expected "Buzz" but found ' + actual + '.');
		}
	}

	test.done();
};

exports['writes FizzBuzz for multiples of 3 and 5'] = function(test, context) {
	var actual;

	for (var i = 1; i <= 100; i++) {
		actual = context.results[i - 1];
		if (i % 3 === 0 && i % 5 === 0) {
			test.equal('FizzBuzz', actual, 'Expected "FizzBuzz" but found ' + actual + '.');
		}
	}

	test.done();
};
