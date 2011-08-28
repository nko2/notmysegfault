exports.setup = function() {
	var results = [];

	function printValue(msg) {
		results.push(msg);
	}

	// Make print function global
	window.printValue = printValue;

	return {
		results: results
	};
};

exports.initialValue = function() {
	return "// Example: printValue('FizzBuzz')";
};
