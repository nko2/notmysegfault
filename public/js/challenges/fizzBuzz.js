exports.name = "FizzBuzz";

exports.description = "Call print for every number between 1 and 100. If the number is a multiple of 3 then print Fizz, if it's a multiple of 5 print Buzz, if it's a multiple of both 3 and 5 print FizzBuzz.";

exports.setup = function() {
	var results = [];

	function print(message) {
		results.push(message);
	}

	print.results = results;
	
	window.print = print;
};

exports.tests = {
	fizzBuzz: function(test) {
		var actual, expected;

		for (var i = 1; i <= 100; i++) {
			actual = print.results[i - 1];

			if (i % 3 === 0 && i % 5 === 0) {
				expected = 'FizzBuzz';
			} else if (i % 5 === 0) {
				expected = 'Buzz';
			} else if (i % 3 === 0) {
				expected = 'Fizz';
			} else {
				expected = i;
			}

			test.equal(actual, expected);
		}

		test.done();
	}
};

